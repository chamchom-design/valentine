# Valentine prank page 💘

Quick, cute webpage that makes the **No** button dodge until someone clicks **Yes**. Friendly, zero-dependency static site you can run locally.

## Files
- `index.html` — page markup
- `styles.css` — styling and animations
- `script.js` — button behavior & celebration
- `scam.py` — small local server (optional)

## Run locally
- Double-click `index.html` OR
- Run a static server from the folder:
  - `python -m http.server 8000` — then open http://localhost:8000
  - or run `python scam.py` to auto-open the page

## Publish (GitHub Pages) — one-click link
You can publish a permanent public link easily. The final URL will be:

https://chamchom-design.github.io/yakine-valentine/

If you prefer a short link you can send:

https://chamchom-design.github.io/yakine-valentine/surprise/

Two quick ways:

1) Web upload (fast, no tools required)
   - Go to https://github.com and sign in.
   - Click **New repository** → name it `yakine-valentine` → **Create repository** (make it Public).
   - Open the repo page → **Add file → Upload files** → drag the *contents* of this project (all files) and Commit.
   - Settings → Pages → Source: **main** / folder: **/(root)** → Save. Wait ~1–2 minutes and open the URL above.

2) Command-line (if you use git)
   - git init
   - git add .
   - git commit -m "Add Valentine site"
   - git branch -M main
   - git remote add origin https://github.com/chamchom-design/yakine-valentine.git
   - git push -u origin main

Notes:
- I added a GitHub Actions workflow (`.github/workflows/pages.yml`) so pushing to `main` will auto-deploy to Pages.
- If you uploaded a ZIP via the web UI, unzip locally and upload the files (don't upload an outer folder).

## Accessibility
- Keyboard: press `Y` for Yes.
- A celebration video will play when she clicks Yes; use the Close button or press Esc to dismiss.

Have fun — and use it kindly! ❤️