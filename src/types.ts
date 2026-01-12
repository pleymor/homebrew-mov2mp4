/**
 * Quality preset affecting file size vs quality tradeoff.
 */
export type QualityPreset = 'low' | 'medium' | 'high';

/**
 * Validates if a string is a valid QualityPreset.
 * @param value - The value to check
 * @returns True if the value is a valid QualityPreset
 */
export function isQualityPreset(value: string): value is QualityPreset {
  return value === 'low' || value === 'medium' || value === 'high';
}

/**
 * CRF values for each quality preset.
 * Lower CRF = higher quality, larger file.
 */
const CRF_VALUES: Record<QualityPreset, number> = {
  low: 28,
  medium: 23,
  high: 18
};

/**
 * Gets the CRF value for a quality preset.
 * @param quality - The quality preset
 * @returns The corresponding CRF value
 */
export function getCrfValue(quality: QualityPreset): number {
  return CRF_VALUES[quality];
}

/**
 * Represents the user's conversion request parsed from CLI arguments.
 */
export interface ConversionOptions {
  /** Absolute path to input .mov file */
  inputPath: string;

  /** Absolute path to output .mp4 file (derived or user-specified) */
  outputPath: string;

  /** Quality preset affecting file size vs quality tradeoff */
  quality: QualityPreset;
}

/**
 * Returned after successful conversion.
 */
export interface ConversionResult {
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

/**
 * Emitted during conversion to report progress.
 */
export interface ConversionProgress {
  /** Percentage complete (0-100) */
  percent: number;

  /** Current time position in video (seconds) */
  currentTime: number;

  /** Total video duration (seconds) */
  totalDuration: number;
}

/**
 * Error codes for validation failures.
 */
export type ValidationErrorCode =
  | 'FILE_NOT_FOUND'
  | 'INVALID_EXTENSION'
  | 'FILE_NOT_READABLE'
  | 'OUTPUT_DIR_NOT_WRITABLE'
  | 'FFMPEG_NOT_INSTALLED';

/**
 * Represents validation failures before conversion starts.
 */
export interface ValidationError {
  /** Error code for programmatic handling */
  code: ValidationErrorCode;

  /** Human-readable error message */
  message: string;
}

/**
 * Result of checking for ffmpeg installation.
 */
export interface FFmpegCheckResult {
  /** Whether ffmpeg is installed and accessible */
  installed: boolean;

  /** Path to ffmpeg binary if found */
  path?: string;

  /** Version string if found (e.g., "6.1.1") */
  version?: string;
}

/**
 * CLI exit codes for scripting compatibility.
 */
export enum ExitCode {
  SUCCESS = 0,
  GENERAL_ERROR = 1,
  VALIDATION_ERROR = 2,
  FFMPEG_ERROR = 3,
  FFMPEG_NOT_FOUND = 4
}
