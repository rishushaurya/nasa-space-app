# Homeward | pipeline/make_grid.py | v1.0.0 | 2026-10-29
"""Planner grids from 1 m HiRISE DTMs: slope (Horn), relief (obstacle proxy), elevation, 2 m cells."""
import math

import numpy as np
import rasterio
from rasterio.windows import from_bounds

from common import DATA, GDAL_ENV, R_SPHERE, SITES, URLS, ZONES, get, write_json

STAC = "https://stac.astrogeology.usgs.gov/api/collections/mro_hirise_socet_dtms/items/"
DTMS = {"gale": "DTEEC_010573_1755_010639_1755_U01", "boxwork": "DTEEC_019698_1750_019988_1750_U01"}


def dtm_url(item: str) -> str:
    return get(STAC + item).json()["assets"]["dtm"]["href"]


def to_xy(lon: float, lat: float):
    return R_SPHERE * math.radians(lon), R_SPHERE * math.radians(lat)


def horn_slope(z: np.ndarray, res: float) -> np.ndarray:
    p = np.pad(z, 1, mode="edge")
    a, b, c = p[:-2, :-2], p[:-2, 1:-1], p[:-2, 2:]
    d, f = p[1:-1, :-2], p[1:-1, 2:]
    g, h, i = p[2:, :-2], p[2:, 1:-1], p[2:, 2:]
    dzdx = ((c + 2 * f + i) - (a + 2 * d + g)) / (8 * res)
    dzdy = ((g + 2 * h + i) - (a + 2 * b + c)) / (8 * res)
    return np.degrees(np.arctan(np.hypot(dzdx, dzdy)))


def local_relief(z: np.ndarray) -> np.ndarray:
    """max - min of the 3 x 3 posts (about 3 m) around each post."""
    p = np.pad(z, 1, mode="edge")
    stack = np.stack([p[dy:dy + z.shape[0], dx:dx + z.shape[1]] for dy in range(3) for dx in range(3)])
    return stack.max(0) - stack.min(0)


def build(zone: str):
    west, east, south, north = ZONES[zone]
    url = dtm_url(DTMS[zone])
    with rasterio.Env(**GDAL_ENV), rasterio.open("/vsicurl/" + url) as ds:
        x0, y0 = to_xy(west, south)
        x1, y1 = to_xy(east, north)
        win = from_bounds(x0, y0, x1, y1, ds.transform).round_offsets().round_lengths()
        z = ds.read(1, window=win, boundless=True, fill_value=ds.nodata).astype("float64")
        res = ds.res[0]
        wt = ds.window_transform(win)
        nodata = ds.nodata
    z[(z <= -1e30) | (z == nodata)] = np.nan
    relief = local_relief(z)
    h, w = (z.shape[0] // 2) * 2, (z.shape[1] // 2) * 2
    blk = lambda a: a[:h, :w].reshape(h // 2, 2, w // 2, 2)
    relief2 = blk(relief).max(axis=(1, 3))
    elev2 = blk(z).mean(axis=(1, 3))           # NaN propagates where any post is missing
    # Slope over the 2 m cells (about a 6 m Horn window): single 1 m posts amplify stereo-DTM noise.
    slope2 = horn_slope(elev2, 2 * res)
    rows, cols = elev2.shape
    west_lon = math.degrees(wt.c / R_SPHERE)
    north_lat = math.degrees(wt.f / R_SPHERE)
    d_deg = math.degrees(2 * res / R_SPHERE)
    out = DATA / "site" / zone
    out.mkdir(parents=True, exist_ok=True)
    np.concatenate([slope2.ravel(), relief2.ravel(), elev2.ravel()]).astype("<f4").tofile(out / "grid.bin")
    header = {"zone": zone, "dtmId": DTMS[zone], "dtmUrl": url, "cols": cols, "rows": rows, "cellM": 2 * res,
              "westLonE": west_lon, "northLatC": north_lat, "dLonDeg": d_deg, "dLatDeg": d_deg,
              "layers": ["slopeDeg", "reliefM", "elevM"], "dtype": "float32-le",
              "processing": [f"Read HiRISE DTM {DTMS[zone]} (1.01 m, CC0-1.0) for box {ZONES[zone]}",
                             "2 x 2 posts per cell: elevation = mean, relief = maximum",
                             "Relief = max - min elevation of the 3x3 posts (about 3 m) around each post (obstacle proxy)",
                             "Slope by Horn's 3x3 method (as gdaldem slope) on the 2 m cells, so DTM noise at single posts does not inflate it",
                             "Cells with any missing post are no-data"]}
    write_json(out / "grid.json", header)
    valid = np.isfinite(elev2)
    print(zone, cols, "x", rows, f"valid {valid.mean():.0%}", f"median slope {np.nanmedian(slope2):.1f} deg")
    return header, slope2, relief2, elev2


def cell_of(hd, lat, lon):
    c = int((lon - hd["westLonE"]) / hd["dLonDeg"])
    r = int((hd["northLatC"] - lat) / hd["dLatDeg"])
    return r, c


if __name__ == "__main__":
    hd, slope, relief, elev = build("gale")
    for s in ("bradbury", "yellowknife"):
        r, c = cell_of(hd, *SITES[s])
        assert np.isfinite(elev[r, c]), f"{s} falls on no-data"
        print(s, "elev", round(float(elev[r, c]), 1), "slope", round(float(slope[r, c]), 1), "relief", round(float(relief[r, c]), 2))
    r, c = cell_of(hd, *SITES["bradbury"])
    near = slope[max(r - 7, 0):r + 8, max(c - 7, 0):c + 8]
    print("landing area median slope", round(float(np.nanmedian(near)), 1))
    hd, slope, relief, elev = build("boxwork")
    for s in ("box_start", "box_stop"):
        r, c = cell_of(hd, *SITES[s])
        print(s, "elev", round(float(elev[r, c]), 1) if np.isfinite(elev[r, c]) else "no-data", "slope", round(float(slope[r, c]), 1))
