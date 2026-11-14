# Homeward | pipeline/usgs_maps.py | v4.0.0 | 2026-11-14
# The footprints of every published USGS geologic map of Mars, from the USGS-NASA Planetary Geologic Mapping
# Program's map database (the layer behind its "Interactive Maps: Mars" viewer). Snapshotted so the app can say which
# maps cover a place on the device, offline, with no new run-time host (PLAN-4 D30). Rings are simplified to about
# 0.05 deg (3 km at the equator), far finer than the 1:75,000 and coarser maps they outline.
import json
import re

from common import DATA, get

LAYER = "https://services.arcgis.com/v01gqwM5QqNysAAi/arcgis/rest/services/PGM_Map_Database_MARS_INTERACTIVE2/FeatureServer/1"
FIELDS = "ShortMapTitle,MapScale,USGSMapNumber,PublicationDate,USGSPublicationPage,MapStatus"
UNIT = {"K": 1e3, "M": 1e6}


def scale(s: str) -> int | None:
    m = re.fullmatch(r"1:([\d.]+)([KM]?)", (s or "").replace(",", "").strip())
    return int(float(m.group(1)) * UNIT.get(m.group(2), 1)) if m else None


def main() -> None:
    q = {"f": "json", "where": "1=1", "outFields": FIELDS, "returnGeometry": "true", "outSR": "4326",
         "maxAllowableOffset": "0.05", "geometryPrecision": "3", "resultRecordCount": "2000"}
    feats = get(f"{LAYER}/query", params=q).json()["features"]
    maps, skipped = [], 0
    for f in feats:
        a, rings = f["attributes"], (f.get("geometry") or {}).get("rings") or []
        title, s = (a.get("ShortMapTitle") or "").strip(), scale(a.get("MapScale"))
        if not title or not s or not rings:  # unpublished or in-progress entries have no title
            skipped += 1
            continue
        maps.append({"title": title, "number": (a.get("USGSMapNumber") or "").strip(), "scale": s,
                     "year": (a.get("PublicationDate") or "").strip(), "url": (a.get("USGSPublicationPage") or "").strip(),
                     "rings": rings})
    maps.sort(key=lambda m: m["scale"])
    out = DATA / "usgs" / "mars-maps.json"
    out.parent.mkdir(exist_ok=True)
    out.write_text(json.dumps({"sourceId": "USGS-PGM-MAP-DB", "maps": maps}, separators=(",", ":")))
    print(f"{len(maps)} maps written to {out.relative_to(DATA.parent.parent.parent)}; {skipped} skipped; {out.stat().st_size / 1024:.0f} KB")


if __name__ == "__main__":
    main()
