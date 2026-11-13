# Homeward | pipeline/rovers.py | v3.0.0 | 2026-11-13
"""Rover stops, drive paths (Curiosity, Perseverance, Spirit, Opportunity), Ingenuity flights, Mars place names and offline copies of featured stops.

Stops are NASA MMGIS waypoints in drive order. The app asks NASA's raw-image APIs for a stop's photos at run time;
the featured stops below are also saved here (raw API records and 512 px copies) so they work offline.
"""
import io
import json
import re

from PIL import Image

from common import DATA, R_SPHERE, get, write_json

MMGIS = "https://mars.nasa.gov/mmgis-maps"
OUT = DATA / "rovers"
PLACES = DATA / "places"
API = {
    "msl": "https://mars.nasa.gov/api/v1/raw_image_items/?order=sol%20asc&per_page=100&page={page}&condition_1=msl:mission"
           "&condition_2={a}:sol:gte&condition_3={b}:sol:lte&condition_4={cam}:instrument",
    "m20": "https://mars.nasa.gov/rss/api/?feed=raw_images&category=mars2020&feedtype=json&num=100&page={page}&order=sol+asc"
           "&search=%7C{cam}&condition_2={a}:sol:gte&condition_3={b}:sol:lte",
}
CAMS = {"msl": ["NAV_LEFT_A", "NAV_LEFT_B"], "m20": ["NAVCAM_LEFT", "MCZ_LEFT"]}
# Featured stops (site, drive) that also work offline: the demo walk zones and Perseverance's landing site.
FEATURED = {"msl": [(6, 0), (26, 184), (120, 0)], "m20": [(3, 0)]}  # Yellowknife Bay, Dingo Gap, boxwork; Jezero landing


def rdp(pts, tol):
    """Douglas-Peucker on [lon, lat] pairs (iterative; tol in degrees)."""
    if len(pts) < 3:
        return pts
    keep = {0, len(pts) - 1}
    stack = [(0, len(pts) - 1)]
    while stack:
        a, b = stack.pop()
        (x1, y1), (x2, y2) = pts[a][:2], pts[b][:2]
        dx, dy = x2 - x1, y2 - y1
        n = (dx * dx + dy * dy) ** 0.5 or 1e-12
        best, idx = 0.0, -1
        for i in range(a + 1, b):
            d = abs(dy * (pts[i][0] - x1) - dx * (pts[i][1] - y1)) / n
            if d > best:
                best, idx = d, i
        if best > tol and idx > 0:
            keep.add(idx)
            stack += [(a, idx), (idx, b)]
    return [pts[i] for i in sorted(keep)]


def lines_of(feats, tol=1.5e-5):  # 1.5e-5 deg is about 0.9 m on Mars
    out = []
    for f in feats:
        g = f["geometry"]
        parts = g["coordinates"] if g["type"] == "MultiLineString" else [g["coordinates"]]
        for part in parts:
            s = rdp([p[:2] for p in part], tol)
            if len(s) > 1:
                out.append([round(v, 7) for p in s for v in p])
    return out


def stops():
    for m, src in (("msl", "MMGIS-MSL-WAYPOINTS"), ("m20", "MMGIS-M20-WAYPOINTS")):
        feats = get(f"{MMGIS}/{m.upper()}/Layers/json/{m.upper()}_waypoints.json").json()["features"]
        rows = [[p["site"], int(p["drive"]), p["sol"], round(p["lat"], 8), round(p["lon"], 8), round(p["elev_geoid"], 2), round(p["yaw"], 2), round(p["dist_total_m"], 1)]
                for p in (f["properties"] for f in feats)]
        rows.sort(key=lambda r: (r[0], r[1]))
        write_json(OUT / f"{m}-stops.json", {"mission": m, "sourceId": src, "fields": ["site", "drive", "sol", "lat", "lon", "elevGeoidM", "yawDeg", "distTotalM"], "rows": rows})
        trav = get(f"{MMGIS}/{m.upper()}/Layers/json/{m.upper()}_traverse.json").json()["features"]
        lines = lines_of(trav)
        write_json(OUT / f"{m}-track.json", {"sourceId": src.replace("WAYPOINTS", "TRAVERSE"), "lines": lines})
        print(m, len(rows), "stops,", sum(len(x) // 2 for x in lines), "track points")


def ingenuity():
    wps = [f["properties"] for f in get(f"{MMGIS}/M20/Layers/json/m20_heli_waypoints.json").json()["features"]]
    path = get(f"{MMGIS}/M20/Layers/json/m20_heli_flight_path.json").json()["features"]
    flights = [[p["Flight"], p["Sol"], round(p["Lat"], 8), round(p["Lon"], 8), p["Max_Alt_m"], round(p["Dist_m"], 1), p["Duration_s"], p["FromAirfld"], p["ToAirfld"], p["Earth_Date"]]
               for p in wps if p["Flight"] > 0]
    write_json(OUT / "ingenuity.json", {"sourceId": "MMGIS-M20-HELI", "fields": ["flight", "sol", "lat", "lon", "maxAltM", "distM", "durationS", "from", "to", "earthDate"],
                                        "flights": flights, "lines": lines_of(path, 3e-6)})
    print("ingenuity", len(flights), "flights")


def gazetteer():
    html = get("https://planetarynames.wr.usgs.gov/SearchResults?Target=20_Mars").text
    rows = []
    for r in re.findall(r"<tr[^>]*>(.*?)</tr>", html, re.S):
        c = [re.sub(r"\s+", " ", re.sub("<[^>]+>", "", x)).strip() for x in re.findall(r"<td[^>]*>(.*?)</td>", r, re.S)]
        if len(c) > 14 and c[0].isdigit() and c[11].startswith("Planetocentric, +East, 0 - 360") and c[17] == "Approved":
            lon = float(c[6])
            rows.append([c[1], float(c[5]), round(lon - 360 if lon > 180 else lon, 4), float(c[4] or 0), c[14].split(",")[0], int(c[0])])
    assert len(rows) > 2000, len(rows)
    write_json(PLACES / "gazetteer.json", {"sourceId": "USGS-GAZETTEER", "fields": ["name", "lat", "lon", "diameterKm", "type", "featureId"], "rows": rows})
    print("gazetteer", len(rows), "features")


AN = "https://an.rsl.wustl.edu/mera/AN/meri/MER/traverse"


def mer():
    """Spirit and Opportunity drive paths from the PDS Geosciences Node (Analyst's Notebook), corrected and interpolated
    by the PDS. Spirit: equirectangular metres centred on 175.5 E, 0 N (MERA_traverse.lbl). Opportunity: metres east and
    north of the landing site; its label names no frame, so the conversion is checked against Victoria crater below."""
    import csv
    import math
    land_b = (-1.9462, -5.5266)  # PDS ODE landing site, as in landers.csv
    for name, f in (("mer-a", "MERA_traverse.csv"), ("mer-b", "MERB_traverse_5130.csv")):
        rows = list(csv.DictReader(io.StringIO(get(f"{AN}/{f}").text)))
        pts, sols = [], []
        for r in rows:
            x, y = float(r["CORRECTED_X"]), float(r["CORRECTED_Y"])
            if name == "mer-a":
                lat, lon = math.degrees(y / R_SPHERE), 175.5 + math.degrees(x / R_SPHERE)
            else:
                lat = land_b[0] + math.degrees(y / R_SPHERE)
                lon = land_b[1] + math.degrees(x / (R_SPHERE * math.cos(math.radians(land_b[0]))))
            pts.append([lon, lat])
            sols.append(int(r["END_SOL"]))
        if name == "mer-b":  # Victoria crater (Gazetteer centre 2.05 S, 5.50 W): Opportunity circled it on sols 951-1634
            v = [p for p, s in zip(pts, sols) if 951 <= s <= 1634]
            assert abs(sum(p[1] for p in v) / len(v) + 2.05) < 0.01 and abs(sum(p[0] for p in v) / len(v) + 5.50) < 0.01
        line = [round(v, 7) for p in rdp(pts, 1.5e-5) for v in p]
        km = sum(math.hypot((pts[i][0] - pts[i - 1][0]) * math.cos(math.radians(pts[i][1])), pts[i][1] - pts[i - 1][1]) for i in range(1, len(pts))) * math.pi / 180 * R_SPHERE / 1000
        write_json(OUT / f"{name}-track.json", {"sourceId": "PDS-AN-MER-TRAVERSE", "lastSol": max(sols), "km": round(km, 2), "lines": [line]})
        print(name, len(rows), "drives,", len(line) // 2, "track points,", round(km, 2), "km, last sol", max(sols))


def featured():
    stops_by = {m: json.loads((OUT / f"{m}-stops.json").read_text())["rows"] for m in FEATURED}
    for m, keys in FEATURED.items():
        rows = stops_by[m]
        for site, drive in keys:
            i = next(i for i, r in enumerate(rows) if r[0] == site and r[1] == drive)
            a, b = rows[i][2], (rows[i + 1][2] if i + 1 < len(rows) else rows[i][2])
            # Same rule as the app (raw.ts atStop): at or after this stop's counter, before the next stop's.
            end = rows[i + 1][1] if i + 1 < len(rows) and rows[i + 1][0] == site else 10**9
            items = []
            for cam in CAMS[m]:
                for page in range(10):
                    d = get(API[m].format(page=page, a=a, b=b, cam=cam)).json()
                    batch = d.get("items") if m == "msl" else d.get("images")
                    if not batch:
                        break
                    items += [x for x in batch if x.get("site") == site and str(x.get("drive")).isdigit() and drive <= int(x["drive"]) < end]
            # Offline copy: full frames with a camera model only, earliest 60 (the arrival panorama comes first).
            items = [x for x in items if (x.get("camera_model_component_list") or x.get("camera", {}).get("camera_model_component_list"))
                     and (x.get("extended", {}).get("sample_type") if m == "msl" else x.get("sample_type")).lower() == "full"][:60]
            local = {}
            for x in items:
                url = (x["https_url"] if m == "msl" else x["image_files"]["medium"]).replace("http://", "https://").replace("mars.jpl.nasa.gov", "mars.nasa.gov")
                name = f"{m}-{site}-{drive}-{x['imageid']}.jpg"
                path = OUT / "cache" / name
                path.parent.mkdir(parents=True, exist_ok=True)
                if not path.exists():
                    im = Image.open(io.BytesIO(get(url).content)).convert("RGB")
                    im.thumbnail((512, 512))
                    im.save(path, quality=80, optimize=True)
                local[x["imageid"]] = f"/data/rovers/cache/{name}"
            write_json(OUT / "cache" / f"{m}-{site}-{drive}.json", {"mission": m, "site": site, "drive": drive, "items": items, "local": local})
            print("featured", m, site, drive, "sols", a, b, len(items), "frames")


if __name__ == "__main__":
    import sys
    steps = {"stops": stops, "ingenuity": ingenuity, "gazetteer": gazetteer, "mer": mer, "featured": featured}
    for step in sys.argv[1:] or steps:  # one step by name, or all of them
        steps[step]()
