# Ryan McKenzie Portfolio Website

Static portfolio site built with semantic HTML, custom CSS, and vanilla JavaScript. The current version is tailored to Ryan McKenzie's resume and prepared for GitHub Pages deployment.

## Files

- `index.html` - page structure and portfolio content
- `style.css` - responsive layout, typography, and visual design
- `script.js` - mobile navigation, reveal animations, and active section highlighting
- `.nojekyll` - disables Jekyll processing for static assets
- `.github/workflows/deploy-pages.yml` - automatic GitHub Pages deployment workflow

## Local preview

Open `index.html` directly in a browser for a quick preview.

## FinalGame demo

The source game can stay in its own separate `FinalGame` repository. The portfolio repo only tracks the browser-ready files in `FinalGameDemo/`.

To rebuild and sync the demo after changing the Go code:

```powershell
powershell -ExecutionPolicy Bypass -File .\sync-finalgame-demo.ps1
```

The WebAssembly demo should be opened through a local or hosted HTTP server rather than `file://`.

## GitHub Pages

1. Open the repository on GitHub.
2. Go to `Settings > Pages`.
3. Under build and deployment, choose `GitHub Actions`.
4. Push changes to the default branch to trigger deployment.
