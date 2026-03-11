# Ryan McKenzie Portfolio Website

Static developer portfolio built with semantic HTML, modern CSS, and vanilla JavaScript. This repository is prepared for immediate GitHub Pages deployment.

## Files included

- `index.html` — page structure and content
- `style.css` — dark-themed responsive styling
- `script.js` — mobile navigation and footer year behavior
- `.nojekyll` — disables Jekyll processing for static assets
- `.github/workflows/deploy-pages.yml` — automatic GitHub Pages deployment workflow

## Replace placeholders before deploying

Update the following placeholders in `index.html`:

- `YOUR_RESUME_LINK`
- `YOUR_GITHUB`
- `YOUR_LINKEDIN`
- `YOUR_EMAIL`
- `YOUR_PORTFOLIO_LINK`
- Project card `#` links for each GitHub and Live Demo button

## Local preview

Open `index.html` directly in your browser, or run a local static server if you prefer.

## Enable GitHub Pages (if needed)

1. Go to your repository on GitHub.
2. Open **Settings → Pages**.
3. Under **Build and deployment**, choose **GitHub Actions** as the source.
4. Push to `main` to trigger deployment.

## Deployment URL

After the workflow runs, your site will be available at:

- `https://<your-github-username>.github.io/<your-repo-name>/`

If this is a user/organization site repository named `<your-github-username>.github.io`, the URL will be:

- `https://<your-github-username>.github.io/`
