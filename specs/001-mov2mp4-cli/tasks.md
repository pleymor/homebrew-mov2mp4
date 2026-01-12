# Tasks: MOV to MP4 Converter CLI

**Input**: Design documents from `/specs/001-mov2mp4-cli/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md

**Tests**: TDD approach enabled (per CLAUDE.md). Tests are written first and must fail before implementation.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Initialize Node.js project with package.json in project root
- [x] T002 Configure TypeScript with tsconfig.json for Node.js CLI
- [x] T003 [P] Configure Jest with ts-jest in jest.config.js
- [x] T004 [P] Configure ESLint with TypeScript support in .eslintrc.js
- [x] T005 Add npm scripts (build, test, test:watch, lint, typecheck) to package.json
- [x] T006 Install dependencies: commander, typescript, jest, ts-jest, @types/node
- [x] T007 Create directory structure: src/, tests/unit/, tests/integration/

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core types and utilities that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

### Tests (TDD - write first, must fail)

- [x] T008 [P] Unit test for types validation in tests/unit/types.test.ts
- [x] T009 [P] Unit test for ffmpeg-check module in tests/unit/ffmpeg-check.test.ts

### Implementation

- [x] T010 Define TypeScript interfaces in src/types.ts (ConversionOptions, ConversionResult, ConversionProgress, ValidationError, QualityPreset, ExitCode)
- [x] T011 Implement ffmpeg-check module in src/ffmpeg-check.ts (detect installation, show instructions)

**Checkpoint**: Foundation ready - types defined, ffmpeg detection working. User story implementation can now begin.

---

## Phase 3: User Story 1 - Basic File Conversion (Priority: P1) 🎯 MVP

**Goal**: Convert a single .mov file to lightweight .mp4 with default settings

**Independent Test**: Run `mov2mp4 input.mov` and verify output.mp4 is created with reduced file size

### Tests for User Story 1 (TDD - write first, must fail)

- [x] T012 [P] [US1] Unit test for validator module in tests/unit/validator.test.ts
- [x] T013 [P] [US1] Unit test for converter module in tests/unit/converter.test.ts
- [x] T014 [P] [US1] Integration test for basic CLI flow in tests/integration/cli.test.ts

### Implementation for User Story 1

- [x] T015 [P] [US1] Implement validator module in src/validator.ts (file exists, .mov extension, readable)
- [x] T016 [US1] Implement converter module in src/converter.ts (spawn ffmpeg, H.264/AAC encoding, CRF 23 default)
- [x] T017 [US1] Implement CLI entry point in src/cli.ts (commander setup, positional input argument, help/version)
- [x] T018 [US1] Implement main entry in src/index.ts (orchestrate validation and conversion)
- [x] T019 [US1] Add shebang and bin entry to package.json for global install

**Checkpoint**: Basic conversion works. `mov2mp4 input.mov` creates output.mp4 with smaller size.

---

## Phase 4: User Story 2 - Custom Output Path (Priority: P2)

**Goal**: Allow users to specify custom output file path via -o/--output flag

**Independent Test**: Run `mov2mp4 input.mov -o custom.mp4` and verify custom.mp4 is created

### Tests for User Story 2 (TDD - write first, must fail)

- [x] T020 [P] [US2] Unit test for output path handling in tests/unit/validator.test.ts (extend existing)
- [x] T021 [P] [US2] Integration test for -o flag in tests/integration/cli.test.ts (extend existing)

### Implementation for User Story 2

- [x] T022 [US2] Add -o/--output option to CLI in src/cli.ts
- [x] T023 [US2] Extend validator to check output directory write permissions in src/validator.ts
- [x] T024 [US2] Update converter to use custom output path in src/converter.ts
- [x] T025 [US2] Update main entry to pass output path through pipeline in src/index.ts

**Checkpoint**: Custom output path works. Both `mov2mp4 input.mov` and `mov2mp4 input.mov -o /path/out.mp4` work correctly.

---

## Phase 5: User Story 3 - Conversion Progress Feedback (Priority: P3)

**Goal**: Display progress percentage and completion summary during/after conversion

**Independent Test**: Run conversion and observe progress updates in terminal, verify summary shows sizes and compression ratio

### Tests for User Story 3 (TDD - write first, must fail)

- [x] T026 [P] [US3] Unit test for progress module in tests/unit/progress.test.ts
- [x] T027 [P] [US3] Unit test for ffmpeg stderr parsing in tests/unit/converter.test.ts (extend existing)

### Implementation for User Story 3

- [x] T028 [P] [US3] Implement progress module in src/progress.ts (display progress bar/percentage, format summary)
- [x] T029 [US3] Add ffmpeg stderr parsing for time progress in src/converter.ts
- [x] T030 [US3] Get video duration via ffprobe in src/converter.ts
- [x] T031 [US3] Integrate progress reporting into main conversion flow in src/index.ts
- [x] T032 [US3] Display completion summary (output path, original size, new size, compression ratio)

**Checkpoint**: Full user experience complete. Progress shows during conversion, summary displays after.

---

## Phase 6: User Story 4 - Quality Presets (Priority: P2.5)

**Goal**: Support -q/--quality flag with low/medium/high presets

**Independent Test**: Run `mov2mp4 input.mov -q low` and verify smaller output than medium quality

### Tests for User Story 4 (TDD - write first, must fail)

- [x] T033 [P] [US4] Unit test for quality preset handling in tests/unit/converter.test.ts (extend existing)
- [x] T034 [P] [US4] Integration test for -q flag in tests/integration/cli.test.ts (extend existing)

### Implementation for User Story 4

- [x] T035 [US4] Add -q/--quality option to CLI in src/cli.ts
- [x] T036 [US4] Map quality presets to CRF values in src/converter.ts (low=28, medium=23, high=18)
- [x] T037 [US4] Update ffmpeg command to use selected CRF in src/converter.ts

**Checkpoint**: Quality presets work. Low quality produces smallest files, high quality produces largest.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T038 [P] Add JSDoc documentation to all exported functions
- [x] T039 [P] Run ESLint and fix any issues
- [x] T040 Verify all error messages are user-friendly (no stack traces)
- [x] T041 Test all edge cases from spec (missing file, invalid extension, permissions, corrupted file)
- [x] T042 Update package.json with proper metadata (name, version, description, author, license)
- [x] T043 Run full test suite and ensure all tests pass
- [ ] T044 Manual end-to-end testing with real .mov files

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phases 3-6)**: All depend on Foundational phase completion
- **Polish (Phase 7)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational - Builds on US1 files but independently testable
- **User Story 3 (P3)**: Can start after Foundational - Builds on US1 files but independently testable
- **User Story 4 (P2.5)**: Can start after Foundational - Builds on US1 files but independently testable

### Within Each User Story

- Tests MUST be written and FAIL before implementation (TDD)
- Core modules before integration
- Commit after each task or logical group

### Parallel Opportunities

**Phase 1 Setup**:
- T003, T004 can run in parallel

**Phase 2 Foundational**:
- T008, T009 can run in parallel (tests)

**Phase 3 User Story 1**:
- T012, T013, T014 can run in parallel (tests)
- T015 can run in parallel with T016 completion

**Phase 4-6 User Stories**:
- Test tasks within each phase can run in parallel
- Different user stories can be worked on in parallel after Foundational

---

## Parallel Example: User Story 1 Tests

```bash
# Launch all tests for User Story 1 together:
Task: "Unit test for validator module in tests/unit/validator.test.ts"
Task: "Unit test for converter module in tests/unit/converter.test.ts"
Task: "Integration test for basic CLI flow in tests/integration/cli.test.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test `mov2mp4 input.mov` works
5. Deploy/demo if ready - basic conversion is valuable on its own

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. Add User Story 1 → MVP! Basic conversion works
3. Add User Story 2 → Custom output paths
4. Add User Story 3 → Progress feedback (full UX)
5. Add User Story 4 → Quality presets (power users)
6. Polish → Production ready

### Recommended Order (Single Developer)

1. Phase 1 → Phase 2 → Phase 3 (MVP)
2. Phase 4 (custom output - simple addition)
3. Phase 6 (quality presets - simple addition)
4. Phase 5 (progress - more complex, adds polish)
5. Phase 7 (final polish)

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- TDD: Write tests first, verify they fail, then implement
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
