# Homeward | pipeline/manifest.py | v1.0.0 | 2026-10-29
"""Hash every data file; the service worker precaches this list for offline use."""
from datetime import datetime, timezone

from common import DATA, ROOT, sha256, write_json

PUBLIC = ROOT / "app" / "public"


def main():
    files = []
    for base in ("data", "models", "ort"):
        for p in sorted((PUBLIC / base).rglob("*")):
            if p.is_file() and p.name != "manifest.json":
                files.append({"path": "/" + p.relative_to(PUBLIC).as_posix(), "bytes": p.stat().st_size, "sha256": sha256(p)})
    write_json(DATA / "manifest.json", {"generatedAt": datetime.now(timezone.utc).isoformat(timespec="seconds"), "totalBytes": sum(f["bytes"] for f in files), "files": files})
    print(len(files), "files,", round(sum(f["bytes"] for f in files) / 1e6, 1), "MB")


if __name__ == "__main__":
    main()
