import * as fs from 'fs';
import * as path from 'path';
import { ValidationError, ValidationErrorCode } from './types';

/**
 * Result of input validation.
 */
export interface ValidationResult {
  /** Whether validation passed */
  valid: boolean;

  /** Resolved absolute path to the input file */
  resolvedPath?: string;

  /** Validation error if validation failed */
  error?: ValidationError;
}

/**
 * Creates a validation error with the given code and message.
 * @param code - Error code
 * @param message - Human-readable error message
 * @returns ValidationError object
 */
function createError(code: ValidationErrorCode, message: string): ValidationError {
  return { code, message };
}

/**
 * Validates input file path for conversion.
 * Checks that the file exists, has .mov extension, and is readable.
 * @param inputPath - Path to the input file
 * @returns ValidationResult indicating success or failure with error details
 */
export function validateInput(inputPath: string): ValidationResult {
  // Resolve to absolute path
  const resolvedPath = path.resolve(inputPath);

  // Check if file exists
  if (!fs.existsSync(resolvedPath)) {
    return {
      valid: false,
      error: createError('FILE_NOT_FOUND', `File does not exist: ${resolvedPath}`)
    };
  }

  // Check extension (case-insensitive)
  const ext = path.extname(resolvedPath).toLowerCase();
  if (ext !== '.mov') {
    return {
      valid: false,
      error: createError('INVALID_EXTENSION', `File must have .mov extension, got: ${ext}`)
    };
  }

  // Check if file is readable
  try {
    fs.accessSync(resolvedPath, fs.constants.R_OK);
  } catch {
    return {
      valid: false,
      error: createError('FILE_NOT_READABLE', `File is not readable: ${resolvedPath}`)
    };
  }

  return {
    valid: true,
    resolvedPath
  };
}

/**
 * Validates output directory is writable.
 * @param outputPath - Path to the output file
 * @returns ValidationResult indicating success or failure with error details
 */
export function validateOutputDir(outputPath: string): ValidationResult {
  const outputDir = path.dirname(outputPath);

  // Check if directory exists and is writable
  try {
    fs.accessSync(outputDir, fs.constants.W_OK);
  } catch {
    return {
      valid: false,
      error: createError('OUTPUT_DIR_NOT_WRITABLE', `Output directory is not writable: ${outputDir}`)
    };
  }

  return { valid: true };
}
