# mov2mp4

A command-line tool to convert .mov files to lightweight .mp4 files using H.264/AAC encoding.

## Why?

macOS Screen Recording creates `.mov` files that are often very large. A 5-minute screen recording can easily be 500MB+. This tool compresses them to a fraction of the size while maintaining good quality, making them easier to share via email, Slack, or upload to the web.

## Requirements

- **Node.js** 20.0.0 or higher
- **FFmpeg** must be installed on your system

### Installing FFmpeg

**Homebrew:**
```bash
brew install ffmpeg
```

**MacPorts:**
```bash
sudo port install ffmpeg
```

## Installation

```bash
npm install -g mov2mp4
```

Or run directly with npx:
```bash
npx mov2mp4 input.mov
```

## Usage

### Basic conversion

Convert a .mov file to .mp4 with default settings (medium quality):

```bash
mov2mp4 recording.mov
```

This creates `recording.mp4` in the same directory.

### Custom output path

Specify where to save the output file:

```bash
mov2mp4 recording.mov -o ~/Desktop/compressed.mp4
```

### Quality presets

Choose between three quality levels:

```bash
# Low quality (smallest file, CRF 28)
mov2mp4 recording.mov -q low

# Medium quality (default, CRF 23)
mov2mp4 recording.mov -q medium

# High quality (largest file, CRF 18)
mov2mp4 recording.mov -q high
```

### Help

```bash
mov2mp4 --help
```

## Example

```bash
$ mov2mp4 screen-recording.mov -q low

Converting: screen-recording.mov
Progress: 100%

Conversion complete!
  Output: screen-recording.mp4
  Original size: 523.4 MB
  New size: 42.1 MB
  Compression: 92% reduction
```

## License

MIT
