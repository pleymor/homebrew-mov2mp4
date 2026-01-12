import { spawn } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';
import { ConversionOptions, ConversionResult, ConversionProgress, getCrfValue } from './types';
import { parseTimeFromFfmpeg, calculateProgress } from './progress';

/**
 * Progress callback function type.
 */
export type ProgressCallback = (progress: ConversionProgress) => void;

/**
 * Generates default output path by replacing .mov extension with .mp4.
 * @param inputPath - Path to the input file
 * @returns Output path with .mp4 extension
 */
export function getDefaultOutputPath(inputPath: string): string {
  const dir = path.dirname(inputPath);
  const basename = path.basename(inputPath, path.extname(inputPath));
  return path.join(dir, `${basename}.mp4`);
}

/**
 * Gets video duration in seconds using ffprobe.
 * @param inputPath - Path to the video file
 * @returns Promise resolving to duration in seconds
 */
export async function getVideoDuration(inputPath: string): Promise<number> {
  return new Promise((resolve, reject) => {
    const ffprobe = spawn('ffprobe', [
      '-v', 'error',
      '-show_entries', 'format=duration',
      '-of', 'default=noprint_wrappers=1:nokey=1',
      inputPath
    ]);

    let output = '';

    ffprobe.stdout.on('data', (data: Buffer) => {
      output += data.toString();
    });

    ffprobe.on('error', (error) => {
      reject(error);
    });

    ffprobe.on('close', (code) => {
      if (code !== 0) {
        reject(new Error('Failed to get video duration'));
        return;
      }

      const duration = parseFloat(output.trim());
      if (isNaN(duration)) {
        reject(new Error('Invalid duration value'));
        return;
      }

      resolve(duration);
    });
  });
}

/**
 * Converts a .mov file to .mp4 using ffmpeg.
 * @param options - Conversion options
 * @param totalDuration - Total video duration in seconds (for progress calculation)
 * @param onProgress - Optional progress callback
 * @returns Promise resolving to ConversionResult
 */
export async function convert(
  options: ConversionOptions,
  totalDuration?: number,
  onProgress?: ProgressCallback
): Promise<ConversionResult> {
  const { inputPath, outputPath, quality } = options;
  const crf = getCrfValue(quality);

  const startTime = Date.now();

  // Get original file size
  const originalSize = fs.statSync(inputPath).size;

  return new Promise((resolve, reject) => {
    const args = [
      '-i', inputPath,
      '-c:v', 'libx264',
      '-crf', crf.toString(),
      '-preset', 'medium',
      '-c:a', 'aac',
      '-b:a', '128k',
      '-y', // Overwrite output file without asking
      outputPath
    ];

    const ffmpeg = spawn('ffmpeg', args);

    // Parse progress from stderr
    if (onProgress && totalDuration) {
      ffmpeg.stderr.on('data', (data: Buffer) => {
        const output = data.toString();
        const currentTime = parseTimeFromFfmpeg(output);

        if (currentTime !== null) {
          const progress = calculateProgress(currentTime, totalDuration);
          onProgress(progress);
        }
      });
    }

    ffmpeg.on('error', (error) => {
      reject(error);
    });

    ffmpeg.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`FFmpeg exited with code ${code}`));
        return;
      }

      const durationMs = Date.now() - startTime;

      // Get new file size
      let newSize: number;
      try {
        newSize = fs.statSync(outputPath).size;
      } catch {
        reject(new Error('Output file was not created'));
        return;
      }

      const compressionRatio = Math.round((newSize / originalSize) * 100);

      resolve({
        outputPath,
        originalSize,
        newSize,
        compressionRatio,
        durationMs
      });
    });
  });
}
