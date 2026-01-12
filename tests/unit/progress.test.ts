import {
  formatProgress,
  formatSummary,
  parseTimeFromFfmpeg,
  formatBytes
} from '../../src/progress';
import { ConversionResult } from '../../src/types';

describe('progress', () => {
  describe('formatProgress', () => {
    it('should format progress as percentage', () => {
      expect(formatProgress(0)).toBe('Converting: 0%');
      expect(formatProgress(50)).toBe('Converting: 50%');
      expect(formatProgress(100)).toBe('Converting: 100%');
    });

    it('should round progress to nearest integer', () => {
      expect(formatProgress(33.33)).toBe('Converting: 33%');
      expect(formatProgress(66.67)).toBe('Converting: 67%');
    });

    it('should clamp progress between 0 and 100', () => {
      expect(formatProgress(-10)).toBe('Converting: 0%');
      expect(formatProgress(150)).toBe('Converting: 100%');
    });
  });

  describe('formatBytes', () => {
    it('should format bytes correctly', () => {
      expect(formatBytes(0)).toBe('0 B');
      expect(formatBytes(1024)).toBe('1.00 KB');
      expect(formatBytes(1024 * 1024)).toBe('1.00 MB');
      expect(formatBytes(1024 * 1024 * 1024)).toBe('1.00 GB');
    });

    it('should handle fractional values', () => {
      expect(formatBytes(1536)).toBe('1.50 KB');
      expect(formatBytes(2.5 * 1024 * 1024)).toBe('2.50 MB');
    });
  });

  describe('parseTimeFromFfmpeg', () => {
    it('should parse time from ffmpeg output', () => {
      const output = 'frame=  100 fps= 30 time=00:00:10.50 bitrate= 500kbits/s';
      expect(parseTimeFromFfmpeg(output)).toBe(10.5);
    });

    it('should parse time with hours', () => {
      const output = 'frame= 1000 fps= 30 time=01:30:45.25 bitrate= 500kbits/s';
      expect(parseTimeFromFfmpeg(output)).toBe(5445.25); // 1*3600 + 30*60 + 45.25
    });

    it('should return null for invalid output', () => {
      expect(parseTimeFromFfmpeg('no time here')).toBeNull();
      expect(parseTimeFromFfmpeg('')).toBeNull();
    });
  });

  describe('formatSummary', () => {
    it('should format conversion summary', () => {
      const result: ConversionResult = {
        outputPath: '/path/to/output.mp4',
        originalSize: 10 * 1024 * 1024, // 10 MB
        newSize: 3 * 1024 * 1024, // 3 MB
        compressionRatio: 30,
        durationMs: 5000
      };

      const summary = formatSummary(result);

      expect(summary).toContain('Conversion complete!');
      expect(summary).toContain('/path/to/output.mp4');
      expect(summary).toContain('10.00 MB');
      expect(summary).toContain('3.00 MB');
      expect(summary).toContain('30%');
      expect(summary).toContain('5.0s');
    });
  });
});
