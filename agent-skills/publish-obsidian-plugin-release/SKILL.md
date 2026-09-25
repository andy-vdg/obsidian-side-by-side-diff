---
name: publish-obsidian-plugin-release
description: Checks whether a Side-by-Side Diff release is ready after the user gives a concrete SemVer version, then provides the safe manual release command. Use when the user asks to prepare, check, or publish a plugin release. It never changes release metadata, creates commits or tags, or pushes.
---

# Check Obsidian Plugin Release Readiness

Use this skill only in the Side-by-Side Diff repository. The repository's `scripts/release.mjs` owns the complete
release transaction: it updates the version metadata and changelog, validates the plugin, creates the release commit
and annotated tag, then pushes both atomically. This skill verifies readiness only; it never runs that transaction.

## Inspect Readiness

- Verify that `scripts/release.mjs`, `manifest.json`, and `versions.json` exist.
- Ask for a target version in `x.y.z` format when none is provided; never infer it from the changes.
- Confirm that `CHANGELOG.md` contains the exact heading `## [Unreleased]` with release notes beneath it; the release
  script rejects an unbracketed `## Unreleased` heading.
- Review the current manifest version, the requested version, and the working tree. The requested version must be
  newer than the current manifest version, and the working tree must be clean before the release script can start.
  Report blockers without cleaning, committing, discarding, or stashing user changes.
- Keep this check read-only. In particular, do not update `CHANGELOG.md`, `manifest.json`, `package.json`,
  `package-lock.json`, or `versions.json`: the release script changes these files as one transaction.

## Hand Off the Release

- Do not run `npm run release`, create a release commit or tag, push, or otherwise publish—even after the user has
  approved a version.
- When the repository is ready, tell the user to run this command themselves from the plugin folder:

```bash
npm run release -- <version>
```

  Replace `<version>` with the requested version. Explain that the command validates the plugin, creates the release
  commit and annotated tag, updates the release metadata and changelog, and pushes them atomically.
- After the user has run it, offer to inspect the resulting Git status, commit, tag, or GitHub release workflow on
  request.

## Recover from a Manually Prepared Version

If the manifest already has the requested version, do not suggest running `npm run release -- <version>`: it rejects
the request because a release target must be newer than the manifest. Explain that the repository has already been
prepared outside the release transaction. Inspect the current commit and tag state, then provide a manual tag-and-push
handoff only when the user asks how to complete that already-pushed version.
