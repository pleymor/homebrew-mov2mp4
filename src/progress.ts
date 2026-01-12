import { ConversionResult, ConversionProgress } from './types';

/**
 * Formats progress as a percentage string.
 * @param percent - Progress percentage (0-100)
 * @returns Formatted progress string
 */
export function formatProgress(percent: number): string {
  const clamped = Math.max(0, Math.min(100, percent));
  return `Converting: ${Math.round(clamped)}%`;
}

/**
 * Formats bytes into human-readable string.
 * @param bytes - Number of bytes
 * @returns Formatted string (e.g., "1.50 MB")
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';

  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const k = 1024;
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${units[i]}`;
}

/**
 * Parses time from ffmpeg stderr output.
 * @param output - FFmpeg stderr output line
 * @returns Time in seconds, or null if not found
 */
export function parseTimeFromFfmpeg(output: string): number | null {
  // Match time=HH:MM:SS.ms pattern
  const match = output.match(/time=(\d{2}):(\d{2}):(\d{2})\.(\d{2})/);

  if (!match) {
    return null;
  }

  const hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const seconds = parseInt(match[3], 10);
  const centiseconds = parseInt(match[4], 10);

  return hours * 3600 + minutes * 60 + seconds + centiseconds / 100;
}

/**
 * Calculates progress from current time and total duration.
 * @param currentTime - Current time in seconds
 * @param totalDuration - Total duration in seconds
 * @returns ConversionProgress object
 */
export function calculateProgress(currentTime: number, totalDuration: number): ConversionProgress {
  const percent = totalDuration > 0 ? (currentTime / totalDuration) * 100 : 0;

  return {
    percent: Math.min(100, percent),
    currentTime,
    totalDuration
  };
}

/**
 * Formats a conversion result as a summary string.
 * @param result - Conversion result
 * @returns Formatted summary string
 */
export function formatSummary(result: ConversionResult): string {
  const durationSec = (result.durationMs / 1000).toFixed(1);

  return `
Conversion complete!
  Output: ${result.outputPath}
  Original size: ${formatBytes(result.originalSize)}
  New size: ${formatBytes(result.newSize)}
  Compression: ${result.compressionRatio}% of original
  Duration: ${durationSec}s
`.trim();
}

/**
 * Displays progress on the console (overwrites current line).
 * @param progress - Progress object
 */
export function displayProgress(progress: ConversionProgress): void {
  const progressStr = formatProgress(progress.percent);
  process.stdout.write(`\r${progressStr}`);
}

/**
 * Clears the progress line and moves to next line.
 */
export function clearProgress(): void {
  process.stdout.write('\r\x1b[K'); // Clear line
}
