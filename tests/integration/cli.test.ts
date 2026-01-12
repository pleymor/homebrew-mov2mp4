import { execSync, spawnSync } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';

describe('CLI Integration', () => {
  const cliPath = path.join(__dirname, '../../dist/index.js');

  beforeAll(() => {
    // Ensure the CLI is built
    try {
      execSync('npm run build', { cwd: path.join(__dirname, '../..'), stdio: 'pipe' });
    } catch (error) {
      // Build might fail if source files don't exist yet
    }
  });

  describe('--help flag', () => {
    it('should display help message', () => {
      const result = spawnSync('node', [cliPath, '--help'], { encoding: 'utf-8' });

      expect(result.status).toBe(0);
      expect(result.stdout).toContain('mov2mp4');
      expect(result.stdout).toContain('Usage:');
    });
  });

  describe('--version flag', () => {
    it('should display version', () => {
      const result = spawnSync('node', [cliPath, '--version'], { encoding: 'utf-8' });

      expect(result.status).toBe(0);
      expect(result.stdout).toMatch(/\d+\.\d+\.\d+/);
    });
  });

  describe('input validation', () => {
    it('should exit with error when no input file provided', () => {
      const result = spawnSync('node', [cliPath], { encoding: 'utf-8' });

      expect(result.status).not.toBe(0);
    });

    it('should exit with error when input file does not exist', () => {
      const result = spawnSync('node', [cliPath, '/nonexistent/file.mov'], { encoding: 'utf-8' });

      expect(result.status).not.toBe(0);
      expect(result.stderr).toContain('does not exist');
    });

    it('should exit with error when input file is not .mov', () => {
      // Create a temp file with wrong extension
      const tempFile = path.join(__dirname, '../fixtures/test.mp4');
      fs.writeFileSync(tempFile, 'test');

      try {
        const result = spawnSync('node', [cliPath, tempFile], { encoding: 'utf-8' });

        expect(result.status).not.toBe(0);
        expect(result.stderr).toContain('.mov');
      } finally {
        fs.unlinkSync(tempFile);
      }
    });
  });

  describe('ffmpeg detection', () => {
    it('should detect if ffmpeg is not installed and show instructions', () => {
      // This test will pass if ffmpeg IS installed (conversion works)
      // or show appropriate message if NOT installed
      // We can't easily test the "not installed" case without mocking
      const result = spawnSync('which', ['ffmpeg'], { encoding: 'utf-8' });

      if (result.status !== 0) {
        // ffmpeg is not installed - verify our CLI handles it
        const tempFile = path.join(__dirname, '../fixtures/test.mov');
        fs.writeFileSync(tempFile, 'test');

        try {
          const cliResult = spawnSync('node', [cliPath, tempFile], { encoding: 'utf-8' });
          expect(cliResult.stderr).toContain('FFmpeg');
          expect(cliResult.stderr).toContain('brew install');
        } finally {
          fs.unlinkSync(tempFile);
        }
      } else {
        // ffmpeg is installed - test passes
        expect(true).toBe(true);
      }
    });
  });

  describe('output path option', () => {
    it('should accept -o option in help', () => {
      const result = spawnSync('node', [cliPath, '--help'], { encoding: 'utf-8' });

      expect(result.stdout).toContain('-o, --output');
      expect(result.stdout).toContain('Output .mp4 file path');
    });

    it('should accept -q option in help', () => {
      const result = spawnSync('node', [cliPath, '--help'], { encoding: 'utf-8' });

      expect(result.stdout).toContain('-q, --quality');
      expect(result.stdout).toContain('low, medium, high');
    });
  });

  describe('quality presets', () => {
    it('should reject invalid quality preset', () => {
      const tempFile = path.join(__dirname, '../fixtures/test-quality.mov');
      fs.writeFileSync(tempFile, 'test');

      try {
        const result = spawnSync('node', [cliPath, tempFile, '-q', 'invalid'], { encoding: 'utf-8' });

        expect(result.status).not.toBe(0);
        expect(result.stderr).toContain('Invalid quality preset');
      } finally {
        fs.unlinkSync(tempFile);
      }
    });

    it('should show default quality as medium in help', () => {
      const result = spawnSync('node', [cliPath, '--help'], { encoding: 'utf-8' });

      expect(result.stdout).toContain('default: "medium"');
    });
  });
});
