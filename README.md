# Trey Docs Site

This directory contains the ready-to-deploy setup for your premium documentation website, powered by **MkDocs Material** and **GitHub Pages**.

## How to Deploy to GitHub Pages

1. Initialize Git in this directory (if not already done):
   ```bash
   git init
   git remote add origin https://github.com/YOUR_ORGANIZATION/YOUR_REPO.git
   git checkout -b main
   git add .
   git commit -m "Initialize premium docs site"
   git push -u origin main
   ```
2. Go to your repository settings on GitHub:
   - Under **Settings** -> **Pages**, change the **Source** to **Deploy from a branch**.
   - Select the branch `gh-pages` (which is automatically built and pushed by our GitHub Action) and folder `/(root)`.
   - Click **Save**.
