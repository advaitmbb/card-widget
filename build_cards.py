#!/usr/bin/env python3
"""Build cards.json for Miles Beyond Borders from the published Google Sheet CSV.

Output shape (matches what the in-post widget already expects):
  { "ok": true, "cards": { "<card_id>": { ...all columns, trimmed... }, ... } }

The card page reads the SAME file and keeps only rows where
show_on_card_page == "yes". Values stay as trimmed strings; the widgets parse
the numbers they need. Aborts without writing if no rows parse, so a failed
fetch never overwrites good data.
"""
import csv
import json
import sys

cards = {}
with open("cards.csv", newline="", encoding="utf-8") as f:
    for row in csv.DictReader(f):
        clean = {}
        for key, val in row.items():
            if key is None:
                continue
            clean[key.strip()] = (val or "").strip()
        card_id = clean.get("card_id", "")
        if not card_id:
            continue
        cards[card_id] = clean

if not cards:
    sys.exit("No rows parsed — aborting so good data isn't overwritten.")

with open("cards.json", "w", encoding="utf-8") as f:
    json.dump({"ok": True, "cards": cards}, f, ensure_ascii=False, indent=0)

print(f"Wrote {len(cards)} cards to cards.json")
