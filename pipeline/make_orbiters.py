# Homeward | pipeline/make_orbiters.py | v3.0.0 | 2026-11-13
# Mars orbiters from JPL Horizons (Mars-centred, ICRF ecliptic of J2000, UT), every 10 minutes, same format as moons.json.
# MAVEN is left out: its Horizons ephemeris ends on 1 Mar 2026. 10-minute steps with velocities keep the cubic Hermite
# error near 1 km even for MRO's 112-minute orbit.
import json
import re
from datetime import datetime, timedelta, timezone

from common import DATA, get

API = "https://ssd.jpl.nasa.gov/api/horizons.api"
START, STOP, STEP_MIN = "2026-11-10 00:00", "2027-01-31 00:00", 10
BODIES = {  # Horizons id: (key, name, agency)
    "-74": ("mro", "Mars Reconnaissance Orbiter", "NASA"),
    "-53": ("odyssey", "Mars Odyssey", "NASA"),
    "-41": ("mex", "Mars Express", "ESA"),
    "-143": ("tgo", "ExoMars Trace Gas Orbiter", "ESA and Roscosmos"),
    "-62": ("hope", "Hope (Emirates Mars Mission)", "UAE (MBRSC)"),
}


def vectors(body: str, stop: str = STOP) -> list[list[int]]:
    q = {"format": "text", "COMMAND": f"'{body}'", "OBJ_DATA": "'NO'", "MAKE_EPHEM": "'YES'", "EPHEM_TYPE": "'VECTORS'",
         "CENTER": "'500@499'", "START_TIME": f"'{START}'", "STOP_TIME": f"'{stop}'", "STEP_SIZE": f"'{STEP_MIN} m'", "VEC_TABLE": "'2'",
         "REF_PLANE": "'ECLIPTIC'", "REF_SYSTEM": "'ICRF'", "OUT_UNITS": "'KM-S'", "CSV_FORMAT": "'YES'", "VEC_LABELS": "'NO'", "TIME_TYPE": "'UT'"}
    text = get(API, params=q).text
    if "$$SOE" not in text:  # predicted ephemerides end at different dates per spacecraft: stop at the published end
        end = re.search(r"after A\.D\. (\d{4}-[A-Z]{3}-\d{2} \d{2}:\d{2})", text)
        assert end and stop == STOP, text[-400:]
        last = datetime.strptime(end.group(1).title(), "%Y-%b-%d %H:%M") - timedelta(minutes=STEP_MIN)
        return vectors(body, last.strftime("%Y-%m-%d %H:%M"))
    rows = text.split("$$SOE")[1].split("$$EOE")[0].strip().splitlines()
    out = []
    for r in rows:
        f = [x.strip() for x in r.split(",")]
        x, y, z, vx, vy, vz = (float(v) for v in f[2:8])
        out.append([round(x), round(y), round(z), round(vx * 1000), round(vy * 1000), round(vz * 1000)])  # km, m/s
    return out


start = datetime.strptime(START, "%Y-%m-%d %H:%M").replace(tzinfo=timezone.utc)
orbiters = []
for hid, (key, name, agency) in BODIES.items():
    rows = vectors(hid)
    assert len(rows) > 500, (key, len(rows))
    end = (start + timedelta(minutes=STEP_MIN * (len(rows) - 1))).isoformat().replace("+00:00", "Z")
    orbiters.append({"id": key, "name": name, "agency": agency, "horizonsId": int(hid), "endUtc": end, "rows": rows})
    print(key, len(rows), "states to", end)
(DATA / "sky" / "orbiters.json").write_text(json.dumps({
    "source": "JPL-HORIZONS-ORBITERS", "frame": "Mars-centred, ICRF, ecliptic of J2000; positions km, velocities m/s",
    "startUtc": start.isoformat().replace("+00:00", "Z"), "stepS": STEP_MIN * 60, "orbiters": orbiters,
}, separators=(",", ":")), encoding="utf-8")
