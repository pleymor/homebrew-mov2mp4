# Tasks: Publish to Homebrew

**Input**: Design documents from `/specs/002-brew-publish/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare npm package for publishing and create tap repository

- [x] T001 Verify package.json has required fields (name, version, bin, files, license) in package.json
- [x] T002 [P] Add repository and homepage fields to package.json
- [x] T003 [P] Verify .npmignore or files field excludes tests and dev files

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Publish npm package - MUST be complete before formula can be created

**⚠️ CRITICAL**: No Homebrew formula tasks can begin until npm package is published

- [x] T004 Login to npm registry with `npm login`
- [x] T005 Run `npm pack --dry-run` to verify package contents
- [x] T006 Publish package to npm with `npm publish`
- [x] T007 Verify package is accessible at https://www.npmjs.com/package/mov2mp4
- [x] T008 Calculate SHA256 hash of npm tarball using `curl -sL https://registry.npmjs.org/mov2mp4/-/mov2mp4-1.0.0.tgz | shasum -a 256`

**Checkpoint**: npm package published and SHA256 obtained. Formula creation can now begin.

---

## Phase 3: User Story 1 - Install via Homebrew (Priority: P1) 🎯 MVP

**Goal**: Enable macOS users to install mov2mp4 with `brew install pleymor/mov2mp4/mov2mp4`

**Independent Test**: Run `brew install pleymor/mov2mp4/mov2mp4 && mov2mp4 --version` on a clean macOS system

### Implementation for User Story 1

- [x] T009 [US1] Create Formula directory in mov2mp4 repo at Formula/
- [x] T010 [US1] Create mov2mp4.rb formula file in Formula/mov2mp4.rb with:
  - desc: "Convert .mov files to lightweight .mp4"
  - homepage: GitHub repo URL
  - url: npm registry tarball URL
  - sha256: placeholder (update after npm publish)
  - license: "MIT"
  - depends_on "node"
  - depends_on "ffmpeg"
  - install block using std_npm_args
  - test block verifying --help and --version
- [x] T011 [US1] Update SHA256 in Formula/mov2mp4.rb after npm publish
- [ ] T012 [US1] Test formula locally with `brew install --build-from-source ./Formula/mov2mp4.rb`
- [ ] T013 [US1] Run `brew test mov2mp4` to verify test block passes
- [ ] T014 [US1] Run `brew audit --formula ./Formula/mov2mp4.rb` to verify formula passes audit
- [ ] T015 [US1] Commit and push formula to mov2mp4 repository
- [ ] T016 [US1] Test installation: `brew install pleymor/mov2mp4/mov2mp4`
- [ ] T017 [US1] Verify `mov2mp4 --version` shows correct version
- [ ] T018 [US1] Verify `mov2mp4 --help` displays help text

**Checkpoint**: Users can install mov2mp4 via Homebrew. MVP complete.

---

## Phase 4: User Story 2 - Update via Homebrew (Priority: P2)

**Goal**: Enable users to upgrade to new versions via `brew upgrade`

**Independent Test**: Install current version, update formula, run `brew upgrade mov2mp4`

### Implementation for User Story 2

- [ ] T019 [US2] Document version update process in README.md (already done - Homebrew section exists)

**Checkpoint**: Update workflow documented. Users can upgrade when new versions are released.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Documentation and final verification

- [x] T020 Update README.md in main mov2mp4 repo with Homebrew installation instructions
- [ ] T021 Test complete installation flow on clean macOS system
- [ ] T022 [P] Verify installation works on Intel Mac (if available)
- [ ] T023 [P] Verify installation works on Apple Silicon Mac (if available)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup - BLOCKS all formula work
- **User Story 1 (Phase 3)**: Depends on Foundational (npm must be published first)
- **User Story 2 (Phase 4)**: Depends on User Story 1 (tap must exist)
- **Polish (Phase 5)**: Depends on User Story 1 completion

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - Core MVP
- **User Story 2 (P2)**: Can start after User Story 1 - Documents update process

### Within Each Phase

- Setup tasks T002, T003 can run in parallel
- Phase 3 tasks are sequential (each builds on previous)
- Polish tasks T022, T023 can run in parallel

### Parallel Opportunities

**Phase 1 Setup**:
- T002, T003 can run in parallel

**Phase 5 Polish**:
- T022, T023 can run in parallel (different hardware)

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (package.json verification)
2. Complete Phase 2: Foundational (npm publish)
3. Complete Phase 3: User Story 1 (formula creation)
4. **STOP and VALIDATE**: Test `brew install pleymor/mov2mp4/mov2mp4`
5. MVP complete - users can install via Homebrew

### Incremental Delivery

1. Setup + Foundational → npm package published
2. Add User Story 1 → Homebrew installation works (MVP!)
3. Add User Story 2 → Update workflow documented
4. Polish → Documentation complete, verified on both architectures

---

## Notes

- [P] tasks = different files/systems, no dependencies
- [Story] label maps task to specific user story for traceability
- Formula lives in Formula/ directory of main mov2mp4 repo
- Formula must pass `brew audit` before publishing
- SHA256 must be calculated from actual npm tarball after publishing
- Users install with: `brew install pleymor/mov2mp4/mov2mp4`
