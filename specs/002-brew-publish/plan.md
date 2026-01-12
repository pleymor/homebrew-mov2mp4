# Implementation Plan: Publish to Homebrew

**Branch**: `002-brew-publish` | **Date**: 2026-01-12 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-brew-publish/spec.md`

## Summary

Publish mov2mp4 to Homebrew via a personal tap, enabling macOS users to install the tool with `brew install`. The formula will download from npm registry and declare Node.js and ffmpeg as dependencies.

## Technical Context

**Language/Version**: Ruby (Homebrew formula DSL), Node.js 20+ (existing project)
**Primary Dependencies**: Homebrew (formula host), npm registry (package source), ffmpeg (runtime)
**Storage**: N/A
**Testing**: `brew test`, `brew audit`
**Target Platform**: macOS (Intel and Apple Silicon)
**Project Type**: Single project with external Homebrew tap repository
**Performance Goals**: Installation < 2 minutes on typical broadband
**Constraints**: Formula must pass `brew audit`, work on both CPU architectures
**Scale/Scope**: Single formula, personal tap repository

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

The constitution template has not been customized for this project. No specific gates defined. Proceeding with standard best practices:
- ✅ Feature is well-scoped (single formula)
- ✅ Dependencies are declared (Node.js, ffmpeg)
- ✅ Testing strategy defined (brew test, brew audit)

## Project Structure

### Documentation (this feature)

```text
specs/002-brew-publish/
├── plan.md              # This file
├── research.md          # Homebrew formula best practices
├── data-model.md        # Formula structure
├── quickstart.md        # How to test and publish
└── tasks.md             # Implementation tasks (created by /speckit.tasks)
```

### Source Code (repository root)

```text
# Existing mov2mp4 project structure (unchanged)
src/
├── cli.ts
├── converter.ts
├── ffmpeg-check.ts
├── index.ts
├── progress.ts
├── types.ts
└── validator.ts

tests/
├── integration/
└── unit/

# New: External Homebrew tap repository (separate repo)
homebrew-tap/           # New GitHub repo: pleymor/homebrew-tap
└── Formula/
    └── mov2mp4.rb      # Homebrew formula file
```

**Structure Decision**: The Homebrew formula lives in a separate repository (`homebrew-tap`) following Homebrew conventions. The main mov2mp4 repo is unchanged except for npm publishing configuration.

## Complexity Tracking

No constitution violations. Simple feature with minimal complexity:
- Single formula file
- Standard Homebrew patterns
- No new dependencies in main project
