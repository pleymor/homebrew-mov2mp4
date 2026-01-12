# Data Model: MOV to MP4 Converter CLI

**Date**: 2026-01-12
**Feature**: 001-mov2mp4-cli

## Overview

This CLI tool has minimal data modeling requirements. It operates on files and configuration options passed via command-line arguments. No persistent storage or database is involved.

## Core Types

### ConversionOptions

Represents the user's conversion request parsed from CLI arguments.

```typescript
interface ConversionOptions {
  /** Absolute path to input .mov file */
  inputPath: string;

  /** Absolute path to output .mp4 file (derived or user-specified) */
  outputPath: string;

  /** Quality preset affecting file size vs quality tradeoff */
  quality: QualityPreset;
}
```

### QualityPreset

Enumeration of available quality levels.

```typescript
type QualityPreset = 'low' | 'medium' | 'high';
```

| Preset | CRF Value | Description |
|--------|-----------|-------------|
| low    | 28        | Smallest file size, acceptable quality |
| medium | 23        | Balanced (default) |
| high   | 18        | Best quality, larger file |

### ConversionResult

Returned after successful conversion.

```typescript
interface ConversionResult {
  /** Absolute path to the created output file */
  outputPath: string;

  /** Original file size in bytes */
  originalSize: number;

  /** Converted file size in bytes */
  newSize: number;

  /** Compression ratio as percentage (e.g., 65 means 65% of original) */
  compressionRatio: number;

  /** Duration of conversion in milliseconds */
  durationMs: number;
}
```

### ConversionProgress

Emitted during conversion to report progress.

```typescript
interface ConversionProgress {
  /** Percentage complete (0-100) */
  percent: number;

  /** Current time position in video (seconds) */
  currentTime: number;

  /** Total video duration (seconds) */
  totalDuration: number;
}
```

### ValidationError

Represents validation failures before conversion starts.

```typescript
interface ValidationError {
  /** Error code for programmatic handling */
  code: ValidationErrorCode;

  /** Human-readable error message */
  message: string;
}

type ValidationErrorCode =
  | 'FILE_NOT_FOUND'
  | 'INVALID_EXTENSION'
  | 'FILE_NOT_READABLE'
  | 'OUTPUT_DIR_NOT_WRITABLE'
  | 'FFMPEG_NOT_INSTALLED';
```

### FFmpegCheckResult

Result of checking for ffmpeg installation.

```typescript
interface FFmpegCheckResult {
  /** Whether ffmpeg is installed and accessible */
  installed: boolean;

  /** Path to ffmpeg binary if found */
  path?: string;

  /** Version string if found (e.g., "6.1.1") */
  version?: string;
}
```

## Exit Codes

The CLI uses standard exit codes for scripting compatibility.

| Code | Constant | Meaning |
|------|----------|---------|
| 0    | SUCCESS  | Conversion completed successfully |
| 1    | GENERAL_ERROR | Unspecified error |
| 2    | VALIDATION_ERROR | Input validation failed |
| 3    | FFMPEG_ERROR | FFmpeg execution failed |
| 4    | FFMPEG_NOT_FOUND | FFmpeg not installed |

```typescript
enum ExitCode {
  SUCCESS = 0,
  GENERAL_ERROR = 1,
  VALIDATION_ERROR = 2,
  FFMPEG_ERROR = 3,
  FFMPEG_NOT_FOUND = 4,
}
```

## File Relationships

```
┌─────────────────┐     converts to     ┌─────────────────┐
│   Input File    │ ─────────────────▶ │   Output File   │
│   (.mov)        │                     │   (.mp4)        │
└─────────────────┘                     └─────────────────┘
        │                                       │
        │                                       │
        ▼                                       ▼
  Must exist                             Created by tool
  Must be readable                       Same dir as input (default)
  Must have .mov extension               Or user-specified path
```

## State Transitions

The conversion process follows a linear state machine:

```
┌──────────┐    ┌────────────┐    ┌────────────┐    ┌───────────┐    ┌───────────┐
│  Start   │───▶│  Validate  │───▶│  Convert   │───▶│  Report   │───▶│   Exit    │
└──────────┘    └────────────┘    └────────────┘    └───────────┘    └───────────┘
                     │                   │
                     │ fail              │ fail
                     ▼                   ▼
               ┌───────────┐       ┌───────────┐
               │   Error   │       │   Error   │
               │   Exit    │       │   Exit    │
               └───────────┘       └───────────┘
```

**States**:
1. **Start**: Parse CLI arguments
2. **Validate**: Check ffmpeg, input file, output path
3. **Convert**: Run ffmpeg, emit progress events
4. **Report**: Display summary (sizes, compression ratio)
5. **Exit**: Return appropriate exit code
