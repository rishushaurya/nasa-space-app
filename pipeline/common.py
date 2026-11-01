# Homeward | pipeline/common.py | v1.0.0 | 2026-10-29
"""Shared helpers for the data pipeline: paths, HTTP with retries, frames, JSON output."""
import hashlib
import json
import math
import time
from pathlib import Path

import requests

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "app" / "public" / "data"
RAW = ROOT / "pipeline" / "raw"
DATA.mkdir(parents=True, exist_ok=True)
RAW.mkdir(parents=True, exist_ok=True)

R_SPHERE = 3396190.0           # USGS products' Mars sphere
A, B = 3396190.0, 3376200.0    # IAU 2015 ellipsoid
K = (A / B) ** 2

SITES = {  # planetocentric lat, east lon (MMGIS waypoints, read 28 Oct 2026)
    "bradbury": (-4.589467, 137.441633),
    "yellowknife": (-4.58948488, 137.4491296),
    "dingo": (-4.62655059, 137.4072626),
    "box_start": (-4.804189, 137.3796858),
    "box_stop": (-4.80799931, 137.3810495),
}
ZONES = {  # planner grid boxes: west, east, south, north (planetocentric deg)
    "gale": (137.432, 137.460, -4.600, -4.580),
    "boxwork": (137.374, 137.388, -4.812, -4.800),
}

GDAL_ENV = dict(GDAL_DISABLE_READDIR_ON_OPEN="YES", CPL_VSIL_CURL_ALLOWED_EXTENSIONS=".tif,.ovr,.cub",
                GDAL_HTTP_MAX_RETRY="5", GDAL_HTTP_RETRY_DELAY="2", VSI_CACHE="TRUE")

URLS = {
    "dtm_gale": "https://astrogeo-ard.s3-us-west-2.amazonaws.com/mars/mro/hirise/controlled/dtm/PSP_010573_1755_PSP_010639_1755/DTEEC_010573_1755_010639_1755_U01.tif",
    "dem_global": "https://asc-pds-services.s3.us-west-2.amazonaws.com/mosaic/Mars/HRSC_MOLA_Blend/Mars_HRSC_MOLA_BlendDEM_Global_200mp_v2.tif",
    "viking_925": "https://asc-pds-services.s3.us-west-2.amazonaws.com/mosaic/Mars_Viking_ClrMosaic_global_925m.tif",
    "viking_232": "https://asc-pds-services.s3.us-west-2.amazonaws.com/mosaic/Mars_Viking_MDIM21_ClrMosaic_global_232m.tif",
    "msl_color": "https://asc-pds-services.s3.us-west-2.amazonaws.com/mosaic/Mars/MSL/MSL_Gale_HiRISE-LRGB_78quads_sharp_cog.tif",
    "waypoints": "https://mars.nasa.gov/mmgis-maps/MSL/Layers/json/MSL_waypoints.json",
    "raw_images": "https://mars.nasa.gov/api/v1/raw_image_items/",
}


def oc_to_og(lat_c: float) -> float:
    return math.degrees(math.atan(math.tan(math.radians(lat_c)) * K))


def og_to_oc(lat_g: float) -> float:
    return math.degrees(math.atan(math.tan(math.radians(lat_g)) / K))


def get(url: str, **kw) -> requests.Response:
    for attempt in range(4):
        try:
            r = requests.get(url, timeout=120, headers={"User-Agent": "Homeward-pipeline/1.0 (NASA Space Apps 2026)"}, **kw)
            r.raise_for_status()
            return r
        except requests.RequestException:
            if attempt == 3:
                raise
            time.sleep(2 ** attempt)
    raise RuntimeError("unreachable")


def write_json(path: Path, obj) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(obj, indent=1, ensure_ascii=False, sort_keys=False), encoding="utf-8")


def sha256(path: Path) -> str:
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(1 << 20), b""):
            h.update(chunk)
    return h.hexdigest()


if __name__ == "__main__":
    assert abs(oc_to_og(-4.5895) - -4.6438) < 1e-4
    assert abs(og_to_oc(oc_to_og(-4.5895)) - -4.5895) < 1e-9
    print("common.py self-check ok")
