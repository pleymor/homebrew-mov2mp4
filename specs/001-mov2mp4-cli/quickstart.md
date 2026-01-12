# Quickstart: MOV to MP4 Converter CLI

**Feature**: 001-mov2mp4-cli
**Date**: 2026-01-12

## Prerequisites

### System Requirements

- **macOS** (Darwin) - other platforms not supported
- **Node.js** 20 or later
- **ffmpeg** installed and available in PATH

### Install ffmpeg

```bash
# Using Homebrew (recommended)
brew install ffmpeg

# Verify installation
ffmpeg -version
```

## Development Setup

### 1. Clone and Install

```bash
# Navigate to project root
cd mov2mp4

# Install dependencies
npm install
```

### 2. Build

```bash
# Compile TypeScript to JavaScript
npm run build
```

### 3. Run Tests

```bash
# Run all tests (TDD approach)
npm test

# Run tests in watch mode during development
npm run test:watch

# Run with coverage
npm run test:coverage
```

### 4. Local Development

```bash
# Link the CLI globally for testing
npm link

# Now you can run from anywhere
mov2mp4 --help
```

## Project Scripts

| Script | Description |
|--------|-------------|
| `npm run build` | Compile TypeScript to `dist/` |
| `npm test` | Run Jest test suite |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript type checking |

## Directory Structure

```
mov2mp4/
├── src/
│   ├── index.ts         # CLI entry point
│   ├── cli.ts           # Argument parsing
│   ├── converter.ts     # FFmpeg wrapper
│   ├── validator.ts     # Input validation
│   ├── progress.ts      # Progress display
│   ├── ffmpeg-check.ts  # Dependency check
│   └── types.ts         # TypeScript interfaces
├── tests/
│   ├── unit/            # Unit tests
│   └── integration/     # End-to-end tests
├── dist/                # Compiled output (git-ignored)
├── package.json
├── tsconfig.json
└── jest.config.js
```

## Usage Examples

### Basic Conversion

```bash
# Convert with default settings (medium quality)
mov2mp4 video.mov

# Output: video.mp4 in same directory
```

### Custom Output Path

```bash
# Specify output file
mov2mp4 video.mov -o converted.mp4

# Specify output in different directory
mov2mp4 video.mov -o ~/Desktop/converted.mp4
```

### Quality Presets

```bash
# Smallest file size
mov2mp4 video.mov -q low

# Balanced (default)
mov2mp4 video.mov -q medium

# Best quality
mov2mp4 video.mov -q high
```

### Help and Version

```bash
# Display help
mov2mp4 --help

# Display version
mov2mp4 --version
```

## Testing During Development

### TDD Workflow

1. **Write test first** for the feature/fix
2. **Run tests** - confirm test fails (red)
3. **Implement** minimal code to pass
4. **Run tests** - confirm test passes (green)
5. **Refactor** if needed
6. **Repeat**

### Test Files for Integration Tests

For integration tests, you'll need sample .mov files. Create a `tests/fixtures/` directory:

```bash
mkdir -p tests/fixtures

# Create a small test video (requires ffmpeg)
ffmpeg -f lavfi -i testsrc=duration=5:size=320x240:rate=30 \
       -f lavfi -i sine=frequency=1000:duration=5 \
       -c:v prores -c:a pcm_s16le \
       tests/fixtures/sample.mov
```

## Debugging

### Verbose ffmpeg Output

During development, you can enable verbose logging by setting an environment variable:

```bash
DEBUG=mov2mp4 mov2mp4 video.mov
```

### Check ffmpeg Command

The tool uses this base ffmpeg command:

```bash
ffmpeg -i input.mov -c:v libx264 -crf 23 -preset medium -c:a aac -b:a 128k output.mp4
```

Test directly with ffmpeg if issues arise:

```bash
ffmpeg -i test.mov -c:v libx264 -crf 23 -preset medium -c:a aac -b:a 128k -y test.mp4
```

## Common Issues

### "ffmpeg: command not found"

FFmpeg is not installed or not in PATH. Install via Homebrew:

```bash
brew install ffmpeg
```

### "Permission denied" on output

Check write permissions for the output directory:

```bash
ls -la /path/to/output/directory
```

### Slow conversion

- Use `-q low` for faster conversion with smaller output
- Ensure sufficient disk space
- Close other CPU-intensive applications
