# Homeward | pipeline/fetch_audio.py | v1.0.0 | 2026-10-29
# Real Mars wind: Perseverance SuperCam microphone, sol 1 (19 Feb 2021), about 18 hours after landing, mast still stowed.
# Credit NASA/JPL-Caltech/LANL/CNES/CNRS/ISAE-Supaero. Played as the ambient bed in the descent and the walk.
from common import DATA, get

URL = "https://assets.science.nasa.gov/content/dam/science/psd/mars/downloadable_items/4/5/45825_SCAM_MIC_SOL001_RUN001.mp3"
out = DATA / "audio" / "supercam-sol001-wind.mp3"
body = get(URL).content
assert body[:3] == b"ID3" or body[:2] in (b"\xff\xfb", b"\xff\xf3", b"\xff\xf2"), "not an MP3"
out.parent.mkdir(parents=True, exist_ok=True)
out.write_bytes(body)
print("audio:", out.name, len(body), "bytes")
