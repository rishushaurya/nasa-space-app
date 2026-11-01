# Homeward | pipeline/build_facts.py | v1.0.0 | 2026-10-29
"""facts.csv + sources.csv -> data/facts.json, data/sources.json, with hard checks."""
import csv
import sys

from common import DATA, ROOT, write_json

BADGES = {"LIVE", "MEASURED", "MODELLED", "COMPUTED", "STANDARD", "ASSUMPTION", "GENERATED"}
STATUS = {"VERIFIED", "SECONDARY", "UNVERIFIED"}


def main() -> int:
    src = list(csv.DictReader(open(ROOT / "pipeline" / "sources.csv", encoding="utf-8")))
    facts = list(csv.DictReader(open(ROOT / "pipeline" / "facts.csv", encoding="utf-8")))
    errors, ids = [], {s["id"] for s in src}
    for s in src:
        if not s["url"].startswith("https://"):
            errors.append(f"source {s['id']}: url must be https")
        if not s["licence"] or not s["credit"]:
            errors.append(f"source {s['id']}: licence and credit required")
        if s["status"] not in STATUS:
            errors.append(f"source {s['id']}: bad status {s['status']}")
    out = []
    for f in facts:
        sids = [x for x in f["sources"].split(";") if x]
        if f["badge"] not in BADGES:
            errors.append(f"fact {f['id']}: bad badge {f['badge']}")
        if not sids or any(x not in ids for x in sids):
            errors.append(f"fact {f['id']}: unknown or missing source {sids}")
        v = f["value"]
        try:
            v = float(v) if v.replace(".", "", 1).lstrip("+-").isdigit() else v
        except ValueError:
            pass
        out.append({"id": f["id"], "label": f["label"], "value": v, "unit": f["unit"] or None, "badge": f["badge"],
                    "sourceIds": sids, "note": f["note"] or None})
    landers = []
    for r in csv.DictReader(open(ROOT / "pipeline" / "landers.csv", encoding="utf-8")):
        sids = [x for x in r["sources"].split(";") if x]
        lat, lon = float(r["lat"]), float(r["lon"])
        if r["badge"] not in BADGES or not sids or any(x not in ids for x in sids):
            errors.append(f"lander {r['id']}: bad badge or unknown source {sids}")
        if not (-90 <= lat <= 90 and -180 <= lon <= 180):
            errors.append(f"lander {r['id']}: lat/lon out of range (planetocentric, east -180..180)")
        landers.append({"id": r["id"], "name": r["name"], "agency": r["agency"], "kind": r["kind"], "landedUtc": r["landedUtc"],
                        "lat": lat, "lon": lon, "badge": r["badge"], "sourceIds": sids, "rover": r["rover"] or None, "note": r["note"]})
    if errors:
        print("\n".join(errors))
        return 1
    write_json(DATA / "facts.json", out)
    write_json(DATA / "sources.json", src)
    write_json(DATA / "places" / "landers.json", landers)
    print(f"{len(out)} facts, {len(src)} sources, {len(landers)} landers")
    return 0


if __name__ == "__main__":
    sys.exit(main())
