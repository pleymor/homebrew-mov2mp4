# Feature Specification: Publish to Homebrew

**Feature Branch**: `002-brew-publish`
**Created**: 2026-01-12
**Status**: Draft
**Input**: User description: "publish to brew"

## Clarifications

### Session 2026-01-12

- Q: Package source for Homebrew formula? → A: npm registry (formula downloads from npmjs.com)

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Install via Homebrew (Priority: P1)

A macOS user wants to install mov2mp4 quickly without dealing with npm or Node.js. They open Terminal and run `brew install mov2mp4` to get the tool ready to use immediately.

**Why this priority**: This is the core value of publishing to Homebrew - enabling simple installation for macOS users who may not have npm installed or prefer native package management.

**Independent Test**: Run `brew install mov2mp4` on a clean macOS system and verify the `mov2mp4` command is available and functional.

**Acceptance Scenarios**:

1. **Given** a macOS user with Homebrew installed, **When** they run `brew tap <username>/tap && brew install mov2mp4`, **Then** the tool is installed and the `mov2mp4` command is available in their PATH
2. **Given** a user has installed mov2mp4 via Homebrew, **When** they run `mov2mp4 --version`, **Then** they see the current version number
3. **Given** a user has installed mov2mp4 via Homebrew, **When** they run `mov2mp4 video.mov`, **Then** the conversion works correctly

---

### User Story 2 - Update via Homebrew (Priority: P2)

A user who previously installed mov2mp4 wants to update to the latest version when a new release is available.

**Why this priority**: Essential for ongoing maintenance but secondary to initial installation.

**Independent Test**: Install an older version, then run `brew upgrade mov2mp4` and verify the new version is installed.

**Acceptance Scenarios**:

1. **Given** a user has an older version of mov2mp4 installed via Homebrew, **When** they run `brew upgrade mov2mp4`, **Then** the latest version is installed
2. **Given** a new version is released, **When** the Homebrew formula is updated, **Then** users can upgrade within 24 hours of the release

---

### Edge Cases

- What happens when the user doesn't have the required ffmpeg dependency? Homebrew automatically installs ffmpeg as a declared dependency.
- How does the formula handle Node.js version requirements? Node.js is declared as a dependency in the formula; Homebrew manages installation.
- What happens if the npm package is not yet published? The formula installation fails with a clear error message; npm package must be published first.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The Homebrew formula MUST install mov2mp4 as a globally available command
- **FR-002**: The formula MUST declare ffmpeg as a dependency so it's installed automatically
- **FR-003**: The formula MUST download the package from the npm registry (npmjs.com)
- **FR-004**: The formula MUST include a test block that verifies the installation works
- **FR-005**: The installation MUST work on both Intel and Apple Silicon Macs
- **FR-006**: The formula MUST specify Node.js as a dependency
- **FR-007**: The npm package MUST be published to the public npm registry before Homebrew formula creation

### Key Entities

- **Homebrew Formula**: Ruby file defining how to download, build, and install mov2mp4
- **Homebrew Tap**: Personal repository hosting custom formulas (e.g., homebrew-tap)
- **npm Package**: The published mov2mp4 package on npmjs.com (source for formula downloads)

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can install mov2mp4 with two commands: `brew tap <username>/tap` followed by `brew install mov2mp4`
- **SC-002**: Installation completes in under 2 minutes on a typical broadband connection
- **SC-003**: The installed tool passes all functional tests (help, version, basic conversion with a .mov file)
- **SC-004**: Formula passes Homebrew's audit checks (`brew audit mov2mp4`)

## Assumptions

- The mov2mp4 npm package will be published under the name "mov2mp4" on npmjs.com
- Distribution will use a personal Homebrew tap (e.g., `pleymor/homebrew-tap`)
- Node.js will be declared as a dependency in the formula

## Out of Scope

- Linux Homebrew (Linuxbrew) support
- Submission to homebrew-core (can be done later once the formula is proven stable)
- Windows package managers (Chocolatey, Scoop, winget)
- Automatic formula updates via GitHub Actions
