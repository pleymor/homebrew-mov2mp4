# Research: MOV to MP4 Converter CLI

**Date**: 2026-01-12
**Feature**: 001-mov2mp4-cli

## Technology Decisions

### 1. Implementation Language

**Decision**: Node.js with TypeScript

**Rationale**:
- TypeScript provides type safety and better developer experience
- Node.js has excellent cross-platform file system APIs
- Easy to create CLI tools with npm bin linking
- Rich ecosystem for CLI argument parsing
- User familiarity (project already uses Node.js tooling based on repo structure)

**Alternatives considered**:
- **Python**: Good for scripting but requires separate installation; less straightforward PATH setup
- **Bash script**: Simplest but limited error handling, no type safety, harder to test
- **Go**: Excellent for CLI tools but introduces new language for small scope project

---

### 2. CLI Argument Parsing

**Decision**: commander.js

**Rationale**:
- Most popular Node.js CLI framework (widely adopted, well-documented)
- Built-in help generation (-h/--help)
- Built-in version flag (--version)
- Supports positional arguments and options
- TypeScript support

**Alternatives considered**:
- **yargs**: Similar features but more complex API
- **meow**: Lighter but less feature-rich for our needs
- **Manual parsing**: More work, error-prone

---

### 3. FFmpeg Integration

**Decision**: Child process execution with `spawn` for streaming output

**Rationale**:
- `spawn` allows streaming stdout/stderr for real-time progress
- ffmpeg outputs progress to stderr, which we can parse
- No need for ffmpeg Node.js bindings (keeps dependencies minimal)
- Direct control over ffmpeg arguments

**Alternatives considered**:
- **fluent-ffmpeg**: npm package wrapping ffmpeg; adds dependency but abstracts complexity. Rejected because direct spawning is simpler for our limited use case.
- **exec**: Buffers entire output; not suitable for progress streaming

---

### 4. FFmpeg Encoding Settings

**Decision**: H.264 video codec with AAC audio, CRF-based quality control

**Rationale**:
- H.264 is universally compatible with all modern players
- AAC audio is the standard for MP4 containers
- CRF (Constant Rate Factor) provides good quality/size balance
- Well-documented, predictable results

**Quality Presets**:

| Preset | CRF Value | Target Use Case |
|--------|-----------|-----------------|
| low    | 28        | Smallest file, acceptable for quick sharing |
| medium | 23        | Balanced quality/size (ffmpeg default) |
| high   | 18        | Best quality, larger file |

**Base ffmpeg command**:
```bash
ffmpeg -i input.mov -c:v libx264 -crf {CRF} -preset medium -c:a aac -b:a 128k output.mp4
```

**Alternatives considered**:
- **H.265/HEVC**: Better compression but slower encoding, less compatible
- **VP9/WebM**: Good compression but MP4 container specifically requested
- **Two-pass encoding**: Better quality but 2x slower; overkill for this use case

---

### 5. Progress Reporting

**Decision**: Parse ffmpeg stderr output for progress percentage

**Rationale**:
- ffmpeg outputs frame/time progress to stderr
- Can calculate percentage from duration (extracted via ffprobe or initial ffmpeg output)
- Simple terminal progress display with percentage and ETA

**Implementation approach**:
1. Get video duration via `ffprobe` or first ffmpeg parse
2. Parse `time=00:00:05.00` from ffmpeg stderr
3. Calculate percentage: `(current_time / total_duration) * 100`
4. Display: `Converting: 45% complete`

---

### 6. Testing Strategy

**Decision**: Jest with ts-jest for unit tests, real ffmpeg for integration tests

**Rationale**:
- Jest is standard for TypeScript/Node.js projects
- Unit tests mock child_process for converter logic
- Integration tests use real ffmpeg with small test fixtures
- TDD approach per user's CLAUDE.md requirements

**Test structure**:
- **Unit**: Validation logic, argument parsing, progress calculation
- **Integration**: End-to-end CLI execution with actual file conversion

---

### 7. Package Distribution

**Decision**: npm package with bin entry point

**Rationale**:
- `npm install -g mov2mp4` adds to PATH automatically
- Standard distribution method for Node.js CLI tools
- Easy versioning and updates

**package.json bin configuration**:
```json
{
  "bin": {
    "mov2mp4": "./dist/index.js"
  }
}
```

---

### 8. FFmpeg Detection

**Decision**: Check PATH via `which ffmpeg` on macOS

**Rationale**:
- Simple subprocess call to check if ffmpeg exists
- Returns path if found, error if not
- macOS-specific (as per spec constraint)

**Installation instructions to display**:
```
FFmpeg is not installed. Install it using one of these methods:

  Using Homebrew (recommended):
    brew install ffmpeg

  Using MacPorts:
    sudo port install ffmpeg

After installation, run mov2mp4 again.
```

## Summary

All technical decisions have been resolved. No NEEDS CLARIFICATION items remain. The implementation uses:

- **Language**: TypeScript on Node.js 20+
- **CLI**: commander.js
- **FFmpeg**: Direct child_process.spawn with stderr progress parsing
- **Encoding**: H.264/AAC with CRF quality control (18/23/28 for high/medium/low)
- **Testing**: Jest with ts-jest
- **Distribution**: npm package with global install support
