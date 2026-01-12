# Research: Publish to Homebrew

**Date**: 2026-01-12
**Feature**: 002-brew-publish

## Homebrew Formula for npm Packages

### Decision: Use npm registry as package source

**Rationale**: [Homebrew documentation](https://docs.brew.sh/Node-for-Formula-Authors) explicitly prefers npm-hosted release tarballs over GitHub sources because:
- Smaller download size (excludes files in .npmignore like tests)
- Pre-transpiled code (no build step needed)
- Standard pattern for Node.js packages

**Alternatives considered**:
- GitHub release tarball: Requires additional release management, includes test files
- Git HEAD: Unstable, not recommended for formulas

### Decision: Install to libexec with std_npm_args

**Rationale**: Homebrew requires Node modules to install to `libexec` to prevent contaminating the global `node_modules` directory. The `std_npm_args` helper method handles this automatically.

**Pattern**:
```ruby
system "npm", "install", *std_npm_args
bin.install_symlink libexec.glob("bin/*")
```

### Decision: Depend on node formula (not versioned)

**Rationale**: mov2mp4 requires Node.js 20+ but is compatible with newer versions. Using the unversioned `node` dependency allows users to benefit from the latest Node.js version while maintaining compatibility.

**Alternatives considered**:
- `node@20`: Locks to specific version, less flexible for users
- `node@22`: Too restrictive

### Decision: Personal tap repository

**Rationale**: Using a personal tap (`pleymor/homebrew-tap`) allows:
- Immediate publishing without homebrew-core review
- Full control over formula updates
- Testing before potential homebrew-core submission

**Alternatives considered**:
- Direct to homebrew-core: Requires review process, higher bar for acceptance
- No Homebrew: npm-only distribution limits macOS users

## npm Registry URL Format

The standard URL pattern for npm packages:
```
https://registry.npmjs.org/<name>/-/<name>-<version>.tgz
```

For mov2mp4 v1.0.0:
```
https://registry.npmjs.org/mov2mp4/-/mov2mp4-1.0.0.tgz
```

## Formula Test Requirements

Tests should verify actual functionality, not just version output. For mov2mp4:
- Test `--help` flag works
- Test `--version` returns expected format
- Cannot test actual conversion (requires .mov file)

## Dependencies

| Dependency | Type | Reason |
|------------|------|--------|
| node | Runtime | Node.js runtime for mov2mp4 |
| ffmpeg | Runtime | Video conversion engine |

## SHA256 Calculation

After publishing to npm, calculate SHA256:
```bash
curl -sL https://registry.npmjs.org/mov2mp4/-/mov2mp4-1.0.0.tgz | shasum -a 256
```

Or use `brew create` to auto-generate the formula with correct SHA256.

## Sources

- [Node for Formula Authors — Homebrew Documentation](https://docs.brew.sh/Node-for-Formula-Authors)
- [homebrew-npm-noob](https://github.com/zmwangx/homebrew-npm-noob) - Tool for generating npm formulas
