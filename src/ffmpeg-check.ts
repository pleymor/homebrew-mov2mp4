import { spawn } from 'child_process';
import { FFmpegCheckResult } from './types';

/**
 * Checks if ffmpeg is installed and accessible.
 * @returns Promise resolving to FFmpegCheckResult
 */
export async function checkFfmpeg(): Promise<FFmpegCheckResult> {
  return new Promise((resolve) => {
    const process = spawn('ffmpeg', ['-version']);
    let output = '';

    process.stdout.on('data', (data: Buffer) => {
      output += data.toString();
    });

    process.on('error', () => {
      resolve({ installed: false });
    });

    process.on('close', (code) => {
      if (code === 0 && output) {
        const versionMatch = output.match(/ffmpeg version (\S+)/);
        resolve({
          installed: true,
          version: versionMatch ? versionMatch[1] : undefined
        });
      } else {
        resolve({ installed: false });
      }
    });
  });
}

/**
 * Returns platform-appropriate installation instructions for ffmpeg.
 * @returns Installation instructions string
 */
export function getInstallInstructions(): string {
  return `
FFmpeg is not installed. Install it using one of these methods:

  Using Homebrew (recommended):
    brew install ffmpeg

  Using MacPorts:
    sudo port install ffmpeg

After installation, run mov2mp4 again.
`.trim();
}
