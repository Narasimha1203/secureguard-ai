# SecureGuard AI: Password & Credential Leak Monitor (Phase 1, frontend)

A futuristic cybersecurity command-center UI built with React, TypeScript, Vite, Three.js (React Three Fiber + Drei), Tailwind CSS and Lucide icons.

## What works in Phase 1

| Feature | Status |
| --- | --- |
| Landing page with 3D holographic globe | Working (decorative illustration, not live data) |
| Password analyzer (show/hide, strength meter, weak patterns, recommendations) | Working, runs in your browser |
| Known compromised-password check (Pwned Passwords, k-anonymity) | Working, called from the browser only when you click the button |
| Security dashboard (session results only) | Working |
| Explainable risk report (weakness vs. breach exposure kept separate) | Working, rule-based |
| Privacy and security tips | Working |
| Email / account breach monitoring | **NOT CONNECTED** (needs backend + HIBP API key) |
| AI-generated explanations | **NOT CONNECTED** (no AI model is trained or used) |
| Alerts and notifications | **NOT CONNECTED** |
| Scan history | **NOT CONNECTED** (nothing is stored) |

## Run it (Windows PowerShell)

1. Install **Node.js LTS** (version 18 or newer) from https://nodejs.org if `node --version` does not work.
2. Open PowerShell and go to the project folder, for example:

   ```powershell
   cd C:\Projects\secureguard-ai
   ```

3. Install dependencies (first time only, needs internet, takes 1-3 minutes):

   ```powershell
   npm install
   ```

4. Start the development server:

   ```powershell
   npm run dev
   ```

5. Open **http://localhost:5173** in Chrome, Edge or Firefox.

Stop the server with `Ctrl + C`.

### Other commands

```powershell
npm run typecheck   # check TypeScript types only
npm run build       # type-check and create a production build in /dist
npm run preview     # serve the production build locally
```

## Open in VS Code

```powershell
code .
```

Then open the built-in terminal with `` Ctrl + ` `` and run `npm run dev`. Recommended extension: **Tailwind CSS IntelliSense**.

## Project structure

```
secureguard-ai/
  index.html                  page shell
  package.json                dependencies and scripts
  vite.config.ts              Vite settings
  tsconfig.json               TypeScript settings
  tailwind.config.js          colors (navy, neon cyan, neon violet) and glows
  postcss.config.js           Tailwind + Autoprefixer
  src/
    main.tsx                  app entry point
    App.tsx                   layout + page switching
    index.css                 Tailwind, glass panels, reduced-motion rules
    types/index.ts            shared types (never contain a raw password)
    services/api.ts           ALL network code: SHA-1, Pwned Passwords range call, backend module status
    lib/passwordAnalysis.ts   pure, local password analysis
    lib/riskReport.ts         pure risk report builder
    lib/cn.ts                 class-name helper
    context/AnalysisContext.tsx   in-memory results (no raw password, no storage)
    hooks/useHashRoute.ts     tiny hash router
    hooks/useReducedMotion.ts reduced-motion detection
    components/
      ui/                     Button, Badge, GlassPanel, StateBlock, PageHeader
      layout/                 Navbar, Footer
      globe/                  HoloGlobe (3D), GlobePanel (wrapper), GlobeFallback (SVG)
      analyzer/               PasswordInput, StrengthMeter, FindingsList, RecommendationsList, BreachCheckPanel
      dashboard/              ScanResultCard, ModuleList
      report/                 RiskReportView
      ErrorBoundary.tsx
    pages/                    Landing, Dashboard, Analyzer, Report, Privacy, NotFound
```

Analysis logic (`lib/`) and network code (`services/`) are separate from presentation (`components/`, `pages/`).

## Security design

- The raw password lives only in the Analyzer page's React state. It is **not** saved to localStorage/sessionStorage/IndexedDB/cookies, **not** put in the URL, **not** logged, and **not** sent to analytics (there are none).
- It is cleared when you press **Clear password**, switch to another browser tab, or leave the Analyzer page.
- Result objects (`PasswordAnalysis`, `RiskReport`, `BreachCheckState`) never contain the password. Only derived data (score, finding names, check outcome) is shared with the dashboard, and only until you reload.
- Error messages are fixed, predefined strings. They never include the password or its hash.
- **Pwned Passwords check (k-anonymity):** the browser computes SHA-1 locally, sends only the first 5 hex characters to `https://api.pwnedpasswords.com/range/<PREFIX>`, receives all matching suffixes, and compares the other 35 characters locally. The check starts only when you click the button.
- **Limit:** this detects *known compromised passwords* only. "Not found" is not proof of safety, and it does not check email addresses or find every possible breach.
- The strength score is a rule-based estimate (length, character variety, common patterns, a tiny built-in common-password list). It is not an AI model.

### Before production (not done in Phase 1)

- Add a Content-Security-Policy header with `connect-src 'self' https://api.pwnedpasswords.com`. It is intentionally not in `index.html` because it would break the Vite dev server.
- When a backend exists, consider proxying the range request there and adding the `Add-Padding: true` header to hide response size.

## Troubleshooting

| Problem | Fix |
| --- | --- |
| `node` / `npm` is not recognized | Install Node.js LTS, then **close and reopen** PowerShell and VS Code. |
| `npm.ps1 cannot be loaded because running scripts is disabled` | Run `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned`, answer `Y`, reopen PowerShell. Or use `npm.cmd install` and `npm.cmd run dev`. |
| `npm install` fails with network errors (`ETIMEDOUT`, `ECONNRESET`) | Check your connection, VPN or proxy, then run `npm install` again. |
| `npm install` shows peer dependency errors | Delete `node_modules` and `package-lock.json`, then run `npm install` again. Do not run `npm audit fix --force`. |
| `Port 5173 is already in use` | Close the other dev server, or run `npm run dev -- --port 5174`. |
| Blank page | Open DevTools (`F12`) > Console and read the first red error. Make sure you opened `http://localhost:5173`, not the `.html` file directly. |
| "3D view unavailable" drawing instead of the globe | Your browser or GPU has WebGL disabled. Enable hardware acceleration in browser settings, or update graphics drivers. The rest of the app still works. |
| Globe is not moving | Your Windows setting "Show animations" is off, so the browser reports reduced motion. This is intentional. |
| Compromised-password check says it could not reach the service | Check internet access. Corporate or school networks may block `api.pwnedpasswords.com`. Wait a minute if you see "Too many requests". |
| `Cannot find module` or red squiggles in VS Code | Run `npm install`, then in VS Code press `Ctrl+Shift+P` > "TypeScript: Restart TS Server". |
| Styles missing (no colors or glass effect) | Confirm `tailwind.config.js` and `postcss.config.js` exist in the project root (not inside `src`), then restart `npm run dev`. |
| `tsc` errors during `npm run build` | Run `npm run typecheck` and fix the first error shown; later ones are often caused by it. |
