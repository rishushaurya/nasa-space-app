# Homeward | pipeline/snapshot.py | v1.0.0 | 2026-10-29
"""Snapshot Curiosity's traverse (MMGIS) and raw images for the replayed sols."""
from common import DATA, URLS, get, write_json

SOL_STORIES = {
    182: "First rock drilling, John Klein, Sheepbed mudstone, Yellowknife Bay",
    528: "Approach to Dingo Gap",
    4709: "Boxwork ridge on Mount Sharp",
}
KEEP = [(3, 300), (520, 545), (4590, 4800)]
CREDIT = {"MAST_LEFT": "NASA/JPL-Caltech/MSSS", "MAST_RIGHT": "NASA/JPL-Caltech/MSSS", "MAHLI": "NASA/JPL-Caltech/MSSS"}


def waypoints():
    feats = get(URLS["waypoints"]).json()["features"]
    pts = [f["properties"] for f in feats]
    keep = [p for p in pts if any(a <= p["sol"] <= b for a, b in KEEP)] + pts[-20:]
    slim = [{k: p[k] for k in ("sol", "site", "drive", "lon", "lat", "elev_geoid", "yaw", "dist_total_m")} for p in keep]
    write_json(DATA / "traverse" / "msl.json", {"source": "MMGIS-MSL-WAYPOINTS", "count_all": len(pts), "latest_sol": pts[-1]["sol"], "points": slim})
    return pts


def images_for(sol: int, want: int = 6):
    q = f"?order=sol%20desc&per_page=100&page=0&condition_1=msl:mission&condition_2={sol}:sol:gte&condition_3={sol}:sol:lte"
    items = get(URLS["raw_images"] + q).json().get("items", [])
    # Full-size colour Mastcam first, then Navcam; skip thumbnails and subframes.
    def score(it):
        inst = it.get("instrument", "")
        return (0 if inst.startswith("MAST") else 1 if "NAV" in inst else 2, it.get("imageid", ""))
    # Product letter before the version digits: I = thumbnail; keep full frames (E, C, ...).
    picked = [it for it in sorted(items, key=score) if len(it.get("imageid", "")) > 22 and it["imageid"][22] != "I"][:want]
    out = []
    for it in picked:
        url = it["url"].replace("http://", "https://")
        name = f"msl-{sol:04d}-{it['imageid']}.jpg"
        path = DATA / "sols" / "img" / name
        path.parent.mkdir(parents=True, exist_ok=True)
        if not path.exists():
            path.write_bytes(get(url).content)
        out.append({"id": it["imageid"], "camera": it.get("instrument"), "file": f"/data/sols/img/{name}",
                    "credit": CREDIT.get(it.get("instrument", ""), "NASA/JPL-Caltech"), "source": url})
    return out


def sol_record(sol: int, pts):
    at = [p for p in pts if p["sol"] <= sol]
    p = at[-1]
    return {"mission": "MSL", "sol": sol, "story": SOL_STORIES[sol],
            "position": {"lat": p["lat"], "lon": p["lon"], "elev": p["elev_geoid"], "yaw": p["yaw"], "waypointSol": p["sol"], "sourceId": "MMGIS-MSL-WAYPOINTS"},
            "images": images_for(sol)}


if __name__ == "__main__":
    pts = waypoints()
    for sol in SOL_STORIES:
        rec = sol_record(sol, pts)
        write_json(DATA / "sols" / f"msl-{sol:04d}.json", rec)
        print(sol, len(rec["images"]), "images at", rec["position"]["lat"], rec["position"]["lon"])
    assert abs([p for p in pts if p["sol"] == 166][0]["lon"] - 137.4491296) < 1e-6
    print("snapshot ok; latest sol", pts[-1]["sol"])
