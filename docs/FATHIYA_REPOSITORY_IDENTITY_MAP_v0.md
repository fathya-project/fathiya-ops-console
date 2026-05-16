# FATHIYA Repository Identity Map v0

## Confirmed repository mapping

- Core / Vault / Knowledge / Runtime source repo: `fathya-core/fathiya-core`
  - URL: <https://github.com/fathya-core/fathiya-core>
- Ops Console / app UI repo: `fathiya-project/fathiya-ops-console`
  - URL: <https://github.com/fathya-project/fathiya-ops-console>

## Direction

- The Command Center UI belongs in the Ops Console repository.
- Core knowledge/runtime artifacts are sourced from the Core repository.
- The Ops Console must treat Core artifacts as read-only inputs until a stable ingestion contract is defined.

## Explicit non-mapping

- Do not use `fathya-core/fathiya-ops-console`.
- `fathya-project/fathiya-core` is not available.

## Safety boundary

The Ops Console integration scaffold does not enable active testing, trading, scanning, webhook delivery, or other external execution. Future ingestion from Core must avoid secrets in client-side code and must preserve explicit human authorization boundaries.
