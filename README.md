# Card Gallery

This project renders PNG "cards" based on bundle definitions in `cards/bundles.json`.

## How it works

- Put PNG folders inside `cards/` (for example, `cards/starter-pack`).
- List each bundle in `cards/bundles.json` with:
  - `id`: unique identifier
  - `title`: display name
  - `path`: relative path to the bundle folder
  - `cards`: list of PNG files and metadata

Each card entry supports:

| Field | Purpose |
| --- | --- |
| `file` | PNG file name inside the bundle folder |
| `title` | Card title shown under the image |
| `text` | Card description shown under the image |
| `rarity` | Number from 1-3 shown in the top-left corner |
| `alt` | Optional alt text for the image |

If `title` or `text` are missing, the UI will fall back to the file name and a placeholder description.

## Local preview

You can serve the folder with any static file server, for example:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000` in your browser.
