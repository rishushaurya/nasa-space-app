# Homeward | pipeline/make_moons.py | v1.0.0 | 2026-10-29
# Phobos and Deimos state vectors from JPL Horizons (Mars-centred, ICRF ecliptic of J2000, UT), hourly.
# The app interpolates with cubic Hermite (position + velocity) and rotates into the Mars-fixed frame.
import json
from datetime import datetime, timezone

from common import DATA, get

API = "https://ssd.jpl.nasa.gov/api/horizons.api"
START, STOP = "2026-10-25 00:00", "2027-03-31 00:00"


def vectors(body: str) -> list[list[int]]:
    q = {"format": "text", "COMMAND": f"'{body}'", "OBJ_DATA": "'NO'", "MAKE_EPHEM": "'YES'", "EPHEM_TYPE": "'VECTORS'",
         "CENTER": "'500@499'", "START_TIME": f"'{START}'", "STOP_TIME": f"'{STOP}'", "STEP_SIZE": "'1 h'", "VEC_TABLE": "'2'",
         "REF_PLANE": "'ECLIPTIC'", "REF_SYSTEM": "'ICRF'", "OUT_UNITS": "'KM-S'", "CSV_FORMAT": "'YES'", "VEC_LABELS": "'NO'", "TIME_TYPE": "'UT'"}
    text = get(API, params=q).text
    rows = text.split("$$SOE")[1].split("$$EOE")[0].strip().splitlines()
    out = []
    for r in rows:
        f = [x.strip() for x in r.split(",")]
        x, y, z, vx, vy, vz = (float(v) for v in f[2:8])
        out.append([round(x), round(y), round(z), round(vx * 1000), round(vy * 1000), round(vz * 1000)])  # km, m/s
    return out


phobos, deimos = vectors("401"), vectors("402")
assert len(phobos) == len(deimos) > 3000, (len(phobos), len(deimos))
start = datetime.strptime(START, "%Y-%m-%d %H:%M").replace(tzinfo=timezone.utc)
(DATA / "sky").mkdir(exist_ok=True)
(DATA / "sky" / "moons.json").write_text(json.dumps({
    "source": "JPL-HORIZONS", "frame": "Mars-centred, ICRF, ecliptic of J2000; positions km, velocities m/s",
    "startUtc": start.isoformat().replace("+00:00", "Z"), "stepS": 3600, "phobos": phobos, "deimos": deimos,
}, separators=(",", ":")), encoding="utf-8")  # compact: about 7,500 rows
print("moons:", len(phobos), "hourly states each, from", START, "to", STOP)
