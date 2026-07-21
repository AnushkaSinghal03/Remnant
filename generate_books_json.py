"""
generate_books_json.py
-----------------------
Reads dataset.csv and produces books.json in the same folder.

Run from the project root:
    python generate_books_json.py

The output books.json will be your single source of truth for the
entire library site. Every page (index, book, authors, e-reader)
will read from this one file.
"""

import csv
import json
import os

# ── Paths ────────────────────────────────────────────────────────────────────
SCRIPT_DIR  = os.path.dirname(os.path.abspath(__file__))
CSV_PATH    = os.path.join(SCRIPT_DIR, "dataset.csv")
OUTPUT_PATH = os.path.join(SCRIPT_DIR, "books.json")

# ── Helpers ───────────────────────────────────────────────────────────────────
def parse_other_categories(raw: str) -> list[str]:
    """Split the comma-separated 'Other Categories' field into a list."""
    if not raw.strip():
        return []
    return [c.strip() for c in raw.split(",") if c.strip()]


def build_epub_path(source_link: str, book_source: str) -> str | None:
    """
    Return a relative path to the epub, or None if this is an external HTML source.
    
    Most books: 'pg902-images-3.epub'  → './assets/epub/pg902-images-3.epub'
    HTML-only:  'https://...'          → None  (handled separately)
    """
    if not source_link.strip():
        return None
    if source_link.startswith("http"):
        return None  # External HTML source, no local epub
    return f"./assets/epub/{source_link.strip()}"


def build_cover_path(book_id: str) -> str:
    """
    Returns the expected cover image path.
    The covers/ folder is currently empty — you'll add covers here later.
    Convention: named after the Book ID (e.g. SS001.jpg, HOR002.jpg)
    """
    return f"./assets/covers/{book_id}.jpg"


# ── Main ─────────────────────────────────────────────────────────────────────
def main():
    books = []

    with open(CSV_PATH, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        
        for row in reader:
            book_id     = row["Book ID"].strip()
            epub_path   = build_epub_path(row["Book Source Link"], row["Book Source"])
            
            # For MYTH002 (Mahabharata), the source is an external HTML URL.
            # We store the external URL in a separate field.
            external_url = None
            if row["Book Source"] == "HTML FILE":
                external_url = row["Book Source Link"].strip()

            book = {
                "id":               book_id,
                "title":            row["Book"].strip(),
                "author":           row["Author"].strip(),
                "authorDeathYear":  row["Author Death Year"].strip(),
                "yearPublished":    row["Year of Publication"].strip(),
                "category":         row["Category"].strip(),
                "otherCategories":  parse_other_categories(row["Other Categories"]),
                "language":         "English",        # All current books are English
                "cover":            build_cover_path(book_id),
                "epub":             epub_path,
                "externalUrl":      external_url,     # None for most books
                "description":      "",               # Fill in manually or via a future script
                "gutenbergId":      row["External Source ID"].strip() or None,
            }
            books.append(book)

    # Wrap in an object — easier to extend later (e.g. add "authors" key)
    output = {
        "books": books
    }

    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        json.dump(output, f, indent=2, ensure_ascii=False)

    print(f"✅ Generated {len(books)} books → {OUTPUT_PATH}")

    # Quick sanity check
    epub_count = sum(1 for b in books if b["epub"])
    html_count = sum(1 for b in books if b["externalUrl"])
    print(f"   📖 {epub_count} books with local epub files")
    print(f"   🌐 {html_count} book(s) with external HTML source only")


if __name__ == "__main__":
    main()
