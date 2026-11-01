# Homeward | pipeline/make_rasters.py | v1.0.0 | 2026-10-29
"""Terrain (Int16) and imagery (JPEG) layers for the 3D globe, from public USGS/NASA mosaics.

Terrain layers are planetocentric grids (the browser converts latitude); each finer layer is
blended towards its parent near its edges so there are no seams. Imagery layers are written with
rows linear in geodetic latitude for the global image; small layers only need converted corners.
"""
import math

import numpy as np
import rasterio
from PIL import Image
from rasterio.enums import Resampling
from rasterio.windows import from_bounds

from common import DATA, GDAL_ENV, R_SPHERE, RAW, URLS, ZONES, oc_to_og, og_to_oc, write_json
from make_grid import DTMS, dtm_url

Image.MAX_IMAGE_PIXELS = None
OUT = DATA / "globe"
OUT.mkdir(parents=True, exist_ok=True)
REGION = (136.0, 139.0, -6.1, -3.1)                    # Gale Crater region (w, e, s, n), 200 m
STRIPS = {"gale": (137.36, 137.48, -4.66, -4.53), "boxwork": (137.35, 137.42, -4.84, -4.77)}  # 8 m
ZONE_PAD = 0.0015                                        # about 90 m around the planner boxes
INNER = {"gale": (137.438, 137.452, -4.594, -4.585), "boxwork": (137.376, 137.385, -4.810, -4.802)}
layers_terrain, layers_imagery = [], []


def xy(lon, lat):
    return R_SPHERE * math.radians(lon), R_SPHERE * math.radians(lat)


def read_box(url, box, shape=None, band=None, resampling=Resampling.average, deg_crs=False):
    w, e, s, n = box
    with rasterio.Env(**GDAL_ENV), rasterio.open(url if url.startswith(("/", "D:", "C:")) else "/vsicurl/" + url) as ds:
        if deg_crs:
            win = from_bounds(w, s, e, n, ds.transform)
        else:
            (x0, y0), (x1, y1) = xy(w, s), xy(e, n)
            win = from_bounds(x0, y0, x1, y1, ds.transform)
        win = win.round_offsets().round_lengths()
        kw = dict(window=win, boundless=True, fill_value=ds.nodata if ds.nodata is not None else 0, resampling=resampling)
        if shape:
            kw["out_shape"] = (ds.count if band is None else 1, *shape)
        data = ds.read(band if band else None, **kw) if band else ds.read(**kw)
        nodata = ds.nodata
    return data, nodata


def blend_to_parent(fine, parent_sampler, box, ramp_px):
    """Fill no-data from the parent and feather the edges towards it."""
    h, w = fine.shape
    lons = box[0] + (np.arange(w) + 0.5) * (box[1] - box[0]) / w
    lats = box[3] - (np.arange(h) + 0.5) * (box[3] - box[2]) / h
    parent = parent_sampler(lats[:, None], lons[None, :])
    valid = np.isfinite(fine)
    off = float(np.nanmedian(fine[valid] - parent[valid])) if valid.any() else 0.0
    fine = fine - off                          # remove the DTM-to-DEM datum offset, recorded below
    m = valid.astype("float64")
    m[:ramp_px // 4, :] = m[-ramp_px // 4:, :] = 0
    m[:, :ramp_px // 4] = m[:, -ramp_px // 4:] = 0
    k = ramp_px
    c = np.cumsum(np.cumsum(np.pad(m, ((k, k), (k, k))), 0), 1)
    box_sum = c[2 * k:, 2 * k:] - c[:-2 * k, 2 * k:] - c[2 * k:, :-2 * k] + c[:-2 * k, :-2 * k]
    wgt = np.clip(box_sum[:h, :w] / (2 * k) ** 2 * 2 - 1, 0, 1) * valid
    out = np.where(valid, fine, parent) * wgt + parent * (1 - wgt)
    return out, off


def sampler_from(grid, box):
    h, w = grid.shape
    def f(lat, lon):
        x = (lon - box[0]) / (box[1] - box[0]) * w - 0.5
        y = (box[3] - lat) / (box[3] - box[2]) * h - 0.5
        x0 = np.clip(np.floor(x).astype(int), 0, w - 2); y0 = np.clip(np.floor(y).astype(int), 0, h - 2)
        fx = np.clip(x - x0, 0, 1); fy = np.clip(y - y0, 0, 1)
        g = grid
        return (g[y0, x0] * (1 - fx) * (1 - fy) + g[y0, x0 + 1] * fx * (1 - fy) + g[y0 + 1, x0] * (1 - fx) * fy + g[y0 + 1, x0 + 1] * fx * fy)
    return f


def save_terrain(name, grid, box, source, note, scale=1.0, offset=0.0):
    q = np.round((grid - offset) / scale)
    assert np.nanmin(q) > -32768 and np.nanmax(q) < 32767, name
    q.astype("<i2").tofile(OUT / f"{name}.i16")
    layers_terrain.append({"name": name, "file": f"/data/globe/{name}.i16", "cols": grid.shape[1], "rows": grid.shape[0],
                           "west": box[0], "east": box[1], "south": box[2], "north": box[3], "scale": scale, "offset": offset,
                           "sourceIds": source, "note": note})
    print("terrain", name, grid.shape, f"{np.nanmin(grid):.0f}..{np.nanmax(grid):.0f} m")


def save_image(name, arr, box, source, note, geodetic_rows=False):
    img = Image.fromarray(np.moveaxis(arr, 0, -1) if arr.ndim == 3 else arr)
    img.convert("RGB").save(OUT / f"{name}.jpg", quality=86, optimize=True, progressive=True)
    corners = (box[0], box[1], box[2], box[3]) if geodetic_rows else (box[0], box[1], oc_to_og(box[2]), oc_to_og(box[3]))
    layers_imagery.append({"name": name, "file": f"/data/globe/{name}.jpg", "width": img.width, "height": img.height,
                           "west": corners[0], "east": corners[1], "south": corners[2], "north": corners[3], "sourceIds": source, "note": note})
    print("image", name, img.size)


def terrain():
    dem = URLS["dem_global"]
    g, nd = read_box(dem, (-180, 180, -90, 90), shape=(1440, 2880), band=1, deg_crs=True)
    g = g.astype("float64"); g[g == nd] = np.nan
    save_terrain("t0-global", g, (-180, 180, -90, 90), ["DATA-21"], "MOLA-HRSC blended DEM 200 m v2, averaged to 7.5 km")
    parent = sampler_from(g, (-180, 180, -90, 90))
    r, nd = read_box(dem, REGION, band=1, deg_crs=True)
    r = r.astype("float64"); r[r == nd] = np.nan
    r, _ = blend_to_parent(r, parent, REGION, 40)
    save_terrain("t1-gale", r, REGION, ["DATA-21"], "MOLA-HRSC blended DEM at full 200 m over Gale Crater")
    region_s = sampler_from(r, REGION)
    for zone, item in DTMS.items():
        url = dtm_url(item)
        box = STRIPS[zone]
        with rasterio.Env(**GDAL_ENV), rasterio.open("/vsicurl/" + url) as ds:
            (x0, y0), (x1, y1) = xy(box[0], box[2]), xy(box[1], box[3])
            win = from_bounds(x0, y0, x1, y1, ds.transform).round_offsets().round_lengths()
            shape = (max(1, int(win.height / 8)), max(1, int(win.width / 8)))
            s = ds.read(1, window=win, boundless=True, fill_value=ds.nodata, out_shape=shape, resampling=Resampling.average).astype("float64")
            s[(s <= -1e30) | (s == ds.nodata)] = np.nan
        s, off_s = blend_to_parent(s, region_s, box, 30)
        base = float(np.nanmedian(s))
        save_terrain(f"t2-{zone}", s, box, ["DATA-03" if zone == "gale" else "DATA-26", "DATA-21"],
                     f"HiRISE DTM {item} at about 8 m, shifted {off_s:+.1f} m to match the 200 m DEM", scale=0.1, offset=base)
        strip_s = sampler_from(s, box)
        w, e, so, n = ZONES[zone]
        zb = (w - ZONE_PAD, e + ZONE_PAD, so - ZONE_PAD, n + ZONE_PAD)
        with rasterio.Env(**GDAL_ENV), rasterio.open("/vsicurl/" + url) as ds:
            (x0, y0), (x1, y1) = xy(zb[0], zb[2]), xy(zb[1], zb[3])
            win = from_bounds(x0, y0, x1, y1, ds.transform).round_offsets().round_lengths()
            z = ds.read(1, window=win, boundless=True, fill_value=ds.nodata).astype("float64")
            z[(z <= -1e30) | (z == ds.nodata)] = np.nan
        z, off_z = blend_to_parent(z, strip_s, zb, 60)
        save_terrain(f"t3-{zone}", z, zb, ["DATA-03" if zone == "gale" else "DATA-26"],
                     f"HiRISE DTM {item} at full 1 m, shifted {off_z:+.1f} m to the 8 m layer", scale=0.1, offset=float(np.nanmedian(z)))


def imagery():
    # Global: Viking colour 925 m, rows remapped to geodetic latitude for Cesium.
    src = str(RAW / "Mars_Viking_ClrMosaic_global_925m.tif")
    with rasterio.open(src) as ds:
        H, W = 4096, 8192
        a = ds.read(out_shape=(3, H, W), resampling=Resampling.average)
    lat_g = 90 - (np.arange(H) + 0.5) * 180 / H
    rows = np.clip(((90 - np.vectorize(og_to_oc)(lat_g)) / 180 * H - 0.5).round().astype(int), 0, H - 1)
    save_image("i0-global", a[:, rows, :], (-180, 180, -90, 90), ["DATA-22b"], "Viking colourised global mosaic 925 m (USGS), resampled to 2.6 km", geodetic_rows=True)
    # Gale region: Viking MDIM 2.1 colour at full 232 m.
    reg, _ = read_box(URLS["viking_232"], REGION)
    save_image("i1-gale", reg, REGION, ["DATA-22"], "Viking MDIM 2.1 colourised mosaic, full 232 m")
    # Traverse: MSL Gale colour HiRISE mosaic, whole extent at about 5 m.
    with rasterio.Env(**GDAL_ENV), rasterio.open("/vsicurl/" + URLS["msl_color"]) as ds:
        b = ds.bounds
        box = (math.degrees(b.left / R_SPHERE), math.degrees(b.right / R_SPHERE), math.degrees(b.bottom / R_SPHERE), math.degrees(b.top / R_SPHERE))
        t = ds.read(out_shape=(3, int(ds.height / 20), int(ds.width / 20)), resampling=Resampling.average)
    save_image("i2-traverse", t, box, ["DATA-24"], "MSL Gale merged HiRISE colour mosaic (Parker and Calef), about 5 m")
    for zone in ZONES:
        w, e, s, n = ZONES[zone]
        zb = (w - ZONE_PAD, e + ZONE_PAD, s - ZONE_PAD, n + ZONE_PAD)
        km_w = (zb[1] - zb[0]) * math.pi / 180 * R_SPHERE
        km_h = (zb[3] - zb[2]) * math.pi / 180 * R_SPHERE
        scale = max(km_w / 4000, km_h / 4000, 0.5)
        z, _ = read_box(URLS["msl_color"], zb, shape=(int(km_h / scale), int(km_w / scale)))
        save_image(f"i3-{zone}", z, zb, ["DATA-24"], f"MSL Gale merged HiRISE colour mosaic, {scale:.2f} m")
        ib = INNER[zone]
        iw = (ib[1] - ib[0]) * math.pi / 180 * R_SPHERE
        ih = (ib[3] - ib[2]) * math.pi / 180 * R_SPHERE
        sc = max(iw / 4000, ih / 4000, 0.25)
        z, _ = read_box(URLS["msl_color"], ib, shape=(int(ih / sc), int(iw / sc)))
        save_image(f"i4-{zone}", z, ib, ["DATA-24"], f"MSL Gale merged HiRISE colour mosaic, {sc:.2f} m (full resolution near the walk)")


if __name__ == "__main__":
    terrain()
    imagery()
    write_json(OUT / "layers.json", {"terrain": layers_terrain, "imagery": layers_imagery,
                                     "heights": "metres relative to the areoid (all sources share it); latitudes in grids are planetocentric"})
    print("layers.json written")
