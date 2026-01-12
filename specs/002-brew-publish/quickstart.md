# Quickstart: Publish to Homebrew

**Date**: 2026-01-12
**Feature**: 002-brew-publish

## Prerequisites

- npm account with publish access
- GitHub account for tap repository
- Homebrew installed locally for testing

## Step 1: Publish to npm

```bash
# Ensure you're logged in to npm
npm login

# Verify package.json is correct
npm pack --dry-run

# Publish to npm registry
npm publish
```

Verify publication:
```bash
npm view mov2mp4
```

## Step 2: Get SHA256 hash

```bash
curl -sL https://registry.npmjs.org/mov2mp4/-/mov2mp4-1.0.0.tgz | shasum -a 256
```

## Step 3: Create Homebrew tap repository

1. Create new GitHub repository: `homebrew-tap`
2. Clone locally:
   ```bash
   git clone git@github.com:pleymor/homebrew-tap.git
   cd homebrew-tap
   mkdir Formula
   ```

## Step 4: Create formula

Create `Formula/mov2mp4.rb`:

```ruby
class Mov2mp4 < Formula
  desc "Convert .mov files to lightweight .mp4"
  homepage "https://github.com/pleymor/mov2mp4"
  url "https://registry.npmjs.org/mov2mp4/-/mov2mp4-1.0.0.tgz"
  sha256 "<SHA256_FROM_STEP_2>"
  license "MIT"

  depends_on "node"
  depends_on "ffmpeg"

  def install
    system "npm", "install", *std_npm_args
    bin.install_symlink libexec.glob("bin/*")
  end

  test do
    assert_match "mov2mp4", shell_output("#{bin}/mov2mp4 --help")
    assert_match version.to_s, shell_output("#{bin}/mov2mp4 --version")
  end
end
```

## Step 5: Test locally

```bash
# Install from local formula
brew install --build-from-source ./Formula/mov2mp4.rb

# Run tests
brew test mov2mp4

# Audit formula
brew audit mov2mp4
```

## Step 6: Push to tap

```bash
cd homebrew-tap
git add Formula/mov2mp4.rb
git commit -m "Add mov2mp4 formula v1.0.0"
git push
```

## Step 7: Test installation

```bash
# Uninstall local version
brew uninstall mov2mp4

# Install via tap
brew tap pleymor/tap
brew install mov2mp4

# Verify
mov2mp4 --version
mov2mp4 --help
```

## Updating the Formula

When releasing a new version:

1. Publish new version to npm: `npm publish`
2. Get new SHA256
3. Update `url` and `sha256` in formula
4. Commit and push to tap

## Troubleshooting

### Formula audit fails
- Check `desc` is < 80 characters
- Ensure `homepage` is valid URL
- Verify `sha256` matches tarball

### Installation fails
- Ensure npm package is published
- Check Node.js and ffmpeg dependencies
- Run `brew doctor` to check Homebrew health

### Test fails
- Verify `bin.install_symlink` creates correct symlinks
- Check executable permissions in package
