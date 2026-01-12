# Data Model: Publish to Homebrew

**Date**: 2026-01-12
**Feature**: 002-brew-publish

## Entities

### Homebrew Formula (mov2mp4.rb)

The formula is a Ruby class that defines how to download, build, and install mov2mp4.

**Structure**:
```ruby
class Mov2mp4 < Formula
  desc "..."           # Short description
  homepage "..."       # Project homepage
  url "..."            # npm registry tarball URL
  sha256 "..."         # SHA256 checksum of tarball
  license "..."        # License (MIT)

  depends_on "node"    # Node.js runtime
  depends_on "ffmpeg"  # Video conversion dependency

  def install
    # Installation commands
  end

  test do
    # Verification commands
  end
end
```

**Fields**:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| desc | String | Yes | One-line description (< 80 chars) |
| homepage | String | Yes | Project URL (GitHub repo) |
| url | String | Yes | npm registry tarball URL |
| sha256 | String | Yes | SHA256 hash of tarball |
| license | String | Yes | SPDX license identifier |
| depends_on | Array | Yes | Runtime dependencies |

### Homebrew Tap Repository

A GitHub repository named `homebrew-tap` that hosts custom formulas.

**Structure**:
```
homebrew-tap/
├── README.md
└── Formula/
    └── mov2mp4.rb
```

**Naming Convention**: Repository must be named `homebrew-<tapname>` for `brew tap <user>/<tapname>` to work.

### npm Package (published)

The mov2mp4 package published to npmjs.com.

**Required package.json fields for Homebrew**:

| Field | Value | Purpose |
|-------|-------|---------|
| name | "mov2mp4" | Package identifier |
| version | "1.0.0" | Semver version |
| bin | {"mov2mp4": "./dist/index.js"} | Executable mapping |
| files | ["dist/"] | Published files |
| license | "MIT" | License for formula |

## Relationships

```
┌─────────────────┐
│   npm Package   │
│   (npmjs.com)   │
└────────┬────────┘
         │ downloads from
         ▼
┌─────────────────┐     ┌─────────────────┐
│ Homebrew Formula│────▶│   Homebrew Tap  │
│  (mov2mp4.rb)   │     │ (homebrew-tap)  │
└────────┬────────┘     └─────────────────┘
         │ declares
         ▼
┌─────────────────┐
│  Dependencies   │
│  (node, ffmpeg) │
└─────────────────┘
```

## State Transitions

### Formula Version Lifecycle

```
[Draft] → [Published to Tap] → [Installed by User] → [Upgraded]
                                        ↓
                                 [Uninstalled]
```

### Publishing Workflow

1. **npm publish**: Package available on registry
2. **Calculate SHA256**: Hash the tarball
3. **Create formula**: Write mov2mp4.rb with URL and hash
4. **Push to tap**: Commit to homebrew-tap repository
5. **User installs**: `brew tap && brew install`
