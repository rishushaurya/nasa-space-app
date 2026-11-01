# Homeward | pipeline/build_corpus.py | v1.0.0 | 2026-10-29
"""corpus.md -> data/corpus.json (assistant retrieval cards)."""
import json
import re
import sys

from common import DATA, ROOT, write_json


def main() -> int:
    text = (ROOT / "pipeline" / "corpus.md").read_text(encoding="utf-8")
    known = {s["id"] for s in json.loads((DATA / "sources.json").read_text(encoding="utf-8"))}
    cards = []
    for block in re.split(r"^## ", text, flags=re.M)[1:]:
        head, *body = block.strip().splitlines()
        cid, title = [x.strip() for x in head.split("|", 1)]
        meta = {k.strip(): v.strip() for k, v in (l.split(":", 1) for l in body if re.match(r"^(sources|keywords):", l))}
        para = " ".join(l for l in body if l and not re.match(r"^(sources|keywords):", l))
        sids = [s.strip() for s in meta["sources"].split(";")]
        assert all(s in known for s in sids), f"{cid}: unknown source {sids}"
        assert len(para.split()) <= 80, f"{cid}: over 80 words"
        cards.append({"id": cid, "title": title, "text": para, "sourceIds": sids, "keywords": [k.strip() for k in meta["keywords"].split(",")]})
    write_json(DATA / "corpus.json", cards)
    print(len(cards), "cards")
    return 0


if __name__ == "__main__":
    sys.exit(main())
