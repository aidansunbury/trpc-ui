# UPGRADE.md

## Overview
This document tracks the plan to **modernize** the `trpc-ui` repository and **upgrade** its dependencies (especially `pnpm` and all runtime packages) while keeping the application functional. The upgrade will be performed incrementally, with each change verified by running the existing test suite and performing manual checks.

## Goals
1. **Upgrade the package manager** from `pnpm@9.15.1` to the latest `pnpm@11.x` (currently `11.2.2`).
2. **Upgrade core dependencies** (`typescript`, `@biomejs/biome`, etc.) to their latest stable versions.
3. **Upgrade workspace packages** (`trpc-ui`, `test-app`, `dev-app`, etc.) to the newest compatible releases.
4. **Maintain compatibility** by resolving any breaking changes through PRs, updates to `tsconfig.json`, or code adjustments.
5. **Document progress** in this file after each major step.

## Prerequisites
- Node.js (version managed via `.node-version` – ensure it matches the project's requirement).
- Access to the repository (already forked and set up).
- SSH key configured for GitHub (see `SSH_CONFIGURATION.md` for details).
- `pnpm` installed globally (currently `9.15.1`).

## Upgrade Strategy
| Step | Action | Command(s) | Verification |
|------|--------|------------|--------------|
| **1** | **Update pnpm globally** | `npm install -g pnpm@latest` | `pnpm --version` should show ≥ `11.2.2` |
| **2** | **Upgrade workspace bootstrap** (`pnpm-workspace.yaml`) | `pnpm install` (after step 1) | Workspace resolves correctly, no lockfile conflicts |
| **3** | **Upgrade core dev dependencies** (`typescript`, `@biomejs/biome`, etc.) | `pnpm up typescript @biomejs/biome` | `tsc --version` and `biome --version` reflect new versions; `pnpm run biome:check` passes |
| **4** | **Upgrade each workspace package** (one at a time) | For each package: <br> `pnpm -F <package-name> up` | Run `pnpm -F <package-name> test` (or `dev`) and ensure no regressions |
| **5** | **Run full test suite** | `pnpm -r run test` (or `pnpm workspace run test`) | All tests pass |
| **6** | **Lint & format** | `pnpm biome:check:fix` and `pnpm biome:check` | No lint errors, formatting applied |
| **7** | **Commit & push** changes | `git add . && git commit -m "chore: upgrade <package> to <version>" && git push` | Verify on GitHub that CI passes |
| **8** | **Document** the version bump in `UPGRADE.md` | Add a new section with date, package, old → new version | File updated |

## Packages to Upgrade (chronological order)
1. **pnpm** (global) – already identified current version `9.15.1` → target `11.2.2` (latest).
2. **typescript** – currently `^4.9.3`.
3. **@biomejs/biome** – currently `1.9.4`.
4. **@types/node** (if present) – ensure compatibility with new Node version.
5. **trpc-ui** – main workspace package; check its `package.json` for dependencies.
6. **test-app** – integration test application.
7. **dev-app** – development environment.
8. Any other workspace packages (e.g., `utils`, `ui`, etc.) – list them after reviewing each `packages/*/package.json`.

## Monitoring & Rollback
- **Continuous Integration**: Ensure GitHub Actions (or other CI) runs on each commit.
- **Manual testing**: After each package upgrade, start the dev server (`pnpm -F <package> dev`) and verify key flows.
- **Rollback**: If a upgrade breaks the build, revert the specific package version in its `package.json` and run `pnpm install`/`pnpm up` to restore the previous state. Record the rollback in this file.

## Initial Steps (to be executed now)
1. Verify current `pnpm` version (`9.15.1`).
2. **✅ Updated `pnpm` globally to the latest release (`11.2.2`).**
3. Commit the initial `UPGRADE.md` file (this step).

---  

*Next action*: Run the command to upgrade `pnpm` globally.