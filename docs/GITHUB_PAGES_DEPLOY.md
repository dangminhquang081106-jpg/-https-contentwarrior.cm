GitHub Pages — Quick deploy guide

This file shows the exact steps and commands to publish this site to GitHub Pages and use your custom domain `contentwarrior.cm`.

1) Create a repository on GitHub (two options)

A — Web UI (recommended if you prefer a browser)
- Go to https://github.com/new
- Repository name: `contentwarrior` (or `<your-username>.github.io` for a user site)
- Visibility: Public
- Create repository (do NOT initialize with README if you plan to push existing files).

B — CLI with `gh` (if installed)
```bash
# create a repo and push local files (replace <GITHUB_USERNAME>)
gh repo create <GITHUB_USERNAME>/contentwarrior --public --source=. --remote=origin --push
# or for a user site:
# gh repo create <GITHUB_USERNAME>/<GITHUB_USERNAME>.github.io --public --source=. --remote=origin --push
```

2) Local git push (if you didn't use `gh` to auto-push)
```bash
git init
git add .
git commit -m "Initial site"
git branch -M main
git remote add origin https://github.com/<GITHUB_USERNAME>/contentwarrior.git
git push -u origin main
```

3) Enable GitHub Pages
- In the repo: Settings → Pages
- Source: `main` branch, folder: `/ (root)`
- Save

4) Add your custom domain in Pages settings
- In Pages settings → Custom domain: enter `contentwarrior.cm` and Save
- GitHub will attempt to provision a TLS certificate once DNS points to GitHub — keep this page open.

5) DNS records at your domain registrar
- Add the following A records for the apex `contentwarrior.cm`:
  - A 185.199.108.153
  - A 185.199.109.153
  - A 185.199.110.153
  - A 185.199.111.153
- Add a CNAME for `www`:
  - CNAME www → <GITHUB_USERNAME>.github.io

Notes:
- You already have a `CNAME` file in the project root with `contentwarrior.cm`. GitHub Pages will use it automatically when you push.
- Wait for DNS propagation (may take a few minutes up to 24h).
- After DNS propagates, GitHub Pages will issue a TLS cert; enable "Enforce HTTPS" in Pages settings when available.

6) Verify
- Visit https://contentwarrior.cm and confirm it loads with a padlock.
- Test via CLI:
```bash
curl -I https://contentwarrior.cm
```

Troubleshooting
- If DNS still points elsewhere, double-check the A records and TTL at your registrar.
- If the site shows mixed-content warnings, ensure all resource URLs are relative or start with https://.
- If GitHub does not provision TLS, wait for DNS propagation; re-check the Pages settings and the CNAME record.

If you want, I can now:
- Patch the `git remote` URL in a small helper script in the repo if you share your GitHub username, or
- Generate exact registrar instructions for adding the A records (tell me the registrar you're using).