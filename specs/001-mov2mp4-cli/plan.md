# Implementation Plan: MOV to MP4 Converter CLI

**Branch**: `001-mov2mp4-cli` | **Date**: 2026-01-12 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-mov2mp4-cli/spec.md`

## Summary

Build a command-line tool called `mov2mp4` that converts .mov files to lightweight .mp4 format using ffmpeg. The tool provides a simple interface with sensible defaults, optional quality presets (low/medium/high), custom output paths, and progress feedback. Targets macOS only.

## Technical Context

**Language/Version**: Node.js 20+ (TypeScript)
**Primary Dependencies**: ffmpeg (system), commander (CLI parsing)
**Storage**: N/A (file-based I/O only)
**Testing**: Jest with ts-jest
**Target Platform**: macOS (Darwin)
**Project Type**: Single CLI application
**Performance Goals**: Convert 1-minute video in under 2 minutes; achieve 30%+ file size reduction
**Constraints**: Requires ffmpeg installed on system; single-file conversion only
**Scale/Scope**: Single-user CLI tool; one file at a time

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Constitution not yet configured for this project. Proceeding with standard best practices:
- [x] TDD approach (per user's CLAUDE.md)
- [x] JSDoc documentation (per user's CLAUDE.md)
- [x] Refactor when cognitive complexity gets too high (per user's CLAUDE.md)
- [x] Simple single-project structure (no over-engineering)

## Project Structure

### Documentation (this feature)

```text
specs/001-mov2mp4-cli/
├── plan.md              # This file
├── research.md          # Phase 0: Technology decisions
├── data-model.md        # Phase 1: Data structures
├── quickstart.md        # Phase 1: Developer setup guide
└── tasks.md             # Phase 2: Implementation tasks (via /speckit.tasks)
```

### Source Code (repository root)

```text
src/
├── index.ts             # CLI entry point
├── cli.ts               # Argument parsing and command setup
├── converter.ts         # Core conversion logic (ffmpeg wrapper)
├── validator.ts         # Input validation (file exists, .mov extension)
├── progress.ts          # Progress reporting during conversion
├── ffmpeg-check.ts      # FFmpeg dependency detection
└── types.ts             # TypeScript interfaces

tests/
├── unit/
│   ├── validator.test.ts
│   ├── converter.test.ts
│   └── ffmpeg-check.test.ts
└── integration/
    └── cli.test.ts
```

**Structure Decision**: Single-project structure. This is a simple CLI tool with no backend/frontend split. All source code lives in `src/` with a flat module structure to keep complexity low.
