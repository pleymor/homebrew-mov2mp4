# mov2mp4

A command-line tool that converts `.mov` files to lightweight `.mp4` files with H.264 video and AAC audio.

This repository holds both the tool's source (TypeScript, published to npm as [`mov2mp4`](https://www.npmjs.com/package/mov2mp4)) and the Homebrew tap that installs it (`Formula/mov2mp4.rb`).

## Why?

macOS Screen Recording creates `.mov` files that are often very large. A 5-minute screen recording can easily be 500MB+. This tool compresses them to a fraction of the size while keeping good quality, so they are easier to share by email, Slack, or upload to the web.

## Installation

### Homebrew (recommended for macOS)

```bash
brew install pleymor/mov2mp4/mov2mp4
```

Homebrew taps this repository and installs `node` and `ffmpeg` as dependencies.

### npm

Requires **Node.js** 20.0.0 or higher and **FFmpeg** on your `PATH` (`brew install ffmpeg` or `sudo port install ffmpeg`).

```bash
npm install -g mov2mp4
```

Or run it directly with npx:

```bash
npx mov2mp4 input.mov
```

## Usage

```text
mov2mp4 <input> [-o, --output <path>] [-q, --quality <preset>]
```

| Option | Description |
| --- | --- |
| `<input>` | Path to the `.mov` file to convert (required) |
| `-o, --output <path>` | Output `.mp4` path. Defaults to the input path with a `.mp4` extension |
| `-q, --quality <preset>` | `low`, `medium` (default) or `high` |
| `-V, --version` | Print the version |
| `-h, --help` | Print help |

An existing file at the output path is overwritten.

### Basic conversion

```bash
mov2mp4 recording.mov
```

This creates `recording.mp4` next to the input file.

### Custom output path

```bash
mov2mp4 recording.mov -o ~/Desktop/compressed.mp4
```

### Quality presets

Each preset maps to an x264 CRF value; a lower CRF means higher quality and a larger file.

```bash
mov2mp4 recording.mov -q low     # CRF 28, smallest file
mov2mp4 recording.mov -q medium  # CRF 23, the default
mov2mp4 recording.mov -q high    # CRF 18, largest file
```

Audio is always encoded as AAC at 128 kbps.

### Example

```text
$ mov2mp4 screen-recording.mov -q low
Converting: /Users/you/screen-recording.mov
Output: /Users/you/screen-recording.mp4
Quality: low

Conversion complete!
  Output: /Users/you/screen-recording.mp4
  Original size: 523.40 MB
  New size: 42.10 MB
  Compression: 8% of original
  Duration: 37.2s
```

A `Converting: NN%` line updates in place while ffmpeg runs.

### Exit codes

| Code | Meaning |
| --- | --- |
| 0 | Success |
| 2 | Invalid input: file missing, not `.mov`, unreadable, bad quality preset, or output directory not writable |
| 3 | ffmpeg failed during conversion |
| 4 | ffmpeg is not installed |

## Development

```bash
npm install      # also builds dist/ through the prepare script
npm run build    # compile src/ to dist/
npm test         # Jest unit and integration tests
npm run lint     # ESLint on src/ and tests/
```

## Maintaining the Homebrew formula

`Formula/mov2mp4.rb` does not build from this repository's source. It downloads the published npm tarball and installs it with `npm install` into Homebrew's `libexec`, then links the `mov2mp4` binary. A new release therefore has to reach npm before the formula can point at it.

To release a new version:

1. Bump `version` in `package.json` and publish to npm:

   ```bash
   npm publish
   ```

2. Compute the SHA-256 of the new tarball:

   ```bash
   curl -sL https://registry.npmjs.org/mov2mp4/-/mov2mp4-<version>.tgz | shasum -a 256
   ```

3. In `Formula/mov2mp4.rb`, update `url` to the new tarball and `sha256` to the hash from step 2.

4. Check the formula locally:

   ```bash
   brew install --build-from-source ./Formula/mov2mp4.rb
   brew test mov2mp4
   brew audit --strict mov2mp4
   ```

   The formula's test runs `mov2mp4 --help` and checks that `mov2mp4 --version` prints the formula's version.

5. Commit the formula change and push to `main`. Users get it with `brew update && brew upgrade mov2mp4`.

## License

MIT
