#!/usr/bin/env node

import { parseArgs } from './cli';
import { validateInput, validateOutputDir } from './validator';
import { convert, getDefaultOutputPath, getVideoDuration } from './converter';
import { checkFfmpeg, getInstallInstructions } from './ffmpeg-check';
import { displayProgress, clearProgress, formatSummary } from './progress';
import { ExitCode, QualityPreset, isQualityPreset } from './types';

/**
 * Main entry point for the mov2mp4 CLI.
 */
async function main(): Promise<void> {
  try {
    // Parse CLI arguments
    const options = parseArgs();

    // Validate quality preset
    if (!isQualityPreset(options.quality)) {
      console.error(`Error: Invalid quality preset "${options.quality}". Use: low, medium, or high`);
      process.exit(ExitCode.VALIDATION_ERROR);
    }

    // Validate input file first (fast validation before ffmpeg check)
    const validation = validateInput(options.input);
    if (!validation.valid) {
      console.error(`Error: ${validation.error!.message}`);
      process.exit(ExitCode.VALIDATION_ERROR);
    }

    // Check if ffmpeg is installed
    const ffmpegCheck = await checkFfmpeg();
    if (!ffmpegCheck.installed) {
      console.error(getInstallInstructions());
      process.exit(ExitCode.FFMPEG_NOT_FOUND);
    }

    const inputPath = validation.resolvedPath!;
    const outputPath = options.output || getDefaultOutputPath(inputPath);
    const quality: QualityPreset = options.quality as QualityPreset;

    // Validate output directory is writable
    const outputValidation = validateOutputDir(outputPath);
    if (!outputValidation.valid) {
      console.error(`Error: ${outputValidation.error!.message}`);
      process.exit(ExitCode.VALIDATION_ERROR);
    }

    // Display conversion info
    console.log(`Converting: ${inputPath}`);
    console.log(`Output: ${outputPath}`);
    console.log(`Quality: ${quality}`);
    console.log('');

    // Get video duration for progress calculation
    let duration: number | undefined;
    try {
      duration = await getVideoDuration(inputPath);
    } catch {
      // If we can't get duration, conversion will still work without progress
      duration = undefined;
    }

    // Perform conversion with progress callback
    const result = await convert(
      { inputPath, outputPath, quality },
      duration,
      (progress) => {
        displayProgress(progress);
      }
    );

    // Clear progress line and display summary
    clearProgress();
    console.log(formatSummary(result));

    process.exit(ExitCode.SUCCESS);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error(`\nError: ${message}`);
    process.exit(ExitCode.FFMPEG_ERROR);
  }
}

main();
