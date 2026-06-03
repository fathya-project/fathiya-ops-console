# FATHIYA Production Deployment Audit - 2026-06-03

## Current Result

The GitHub repository is ready for deployment, but the live `fathya-core.com`
domain is still serving the older Bolt/Netlify build.

## Evidence

- Repository: `fathya-project/fathiya-ops-console`
- Latest pushed commit: `e42bea470300c48edb0f4737a69ff662a3d39dc3`
- Commit message: `feat: activate agentic learning console`
- Local verification passed:
  - `npm run typecheck`
  - `npm run lint`
  - `npm run build`
  - `netlify/functions/learning-status.mjs` returns `learning_foundation_active`
- Local browser verification passed:
  - `/command-center` opens without the login gate
  - the learning panel is visible
  - the understanding check button creates a local receipt
- Live domain verification did not pass yet:
  - `https://fathya-core.com/` still serves asset `assets/index-_vp2bHYL.js`
  - `https://fathya-core.com/api/learning/status` still returns the old HTML shell
  - `https://fathya-core.com/learning-status.json` still returns the old HTML shell
- GitHub repository deployment signals:
  - repository webhooks: `0`
  - repository deployments: `0`
  - Netlify deployment through Zapier cannot proceed until Netlify OAuth is connected

## Interpretation

The code is not the active blocker. The active blocker is deployment ownership:
the live site is hosted by Bolt/Netlify, but the current GitHub repository is
not connected to an automatic deploy hook for that live site.

## Required Production Step

Choose one of these deployment paths:

1. Connect the Netlify account in Zapier MCP, then trigger the Netlify deploy
   action for the `fathya-core.com` site.
2. Open the Bolt project for this repository, import or sync the latest GitHub
   commit, and publish the project again.
3. Connect the live Netlify site directly to this GitHub repository and enable
   automatic deploys from `main`.

## Expected Production Verification

After deployment, these checks should pass:

```text
GET https://fathya-core.com/command-center
  contains: Learning Core / Nawat al-taallum wal-fahm

GET https://fathya-core.com/learning-status.json
  status: learning_foundation_active

GET https://fathya-core.com/api/learning/status
  status: learning_foundation_active
```

The CI workflow now builds the project and uploads the `dist` artifact on every
push to `main`, so the current deployable bundle can be recovered from GitHub
Actions even before the Netlify/Bolt connection is fixed.
