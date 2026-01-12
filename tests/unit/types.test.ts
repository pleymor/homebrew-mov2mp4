import {
  ExitCode,
  ValidationErrorCode,
  isQualityPreset,
  getCrfValue
} from '../../src/types';

describe('types', () => {
  describe('QualityPreset', () => {
    it('should recognize valid quality presets', () => {
      expect(isQualityPreset('low')).toBe(true);
      expect(isQualityPreset('medium')).toBe(true);
      expect(isQualityPreset('high')).toBe(true);
    });

    it('should reject invalid quality presets', () => {
      expect(isQualityPreset('invalid')).toBe(false);
      expect(isQualityPreset('')).toBe(false);
      expect(isQualityPreset('LOW')).toBe(false);
    });
  });

  describe('getCrfValue', () => {
    it('should return correct CRF value for low quality', () => {
      expect(getCrfValue('low')).toBe(28);
    });

    it('should return correct CRF value for medium quality', () => {
      expect(getCrfValue('medium')).toBe(23);
    });

    it('should return correct CRF value for high quality', () => {
      expect(getCrfValue('high')).toBe(18);
    });
  });

  describe('ExitCode', () => {
    it('should have correct exit code values', () => {
      expect(ExitCode.SUCCESS).toBe(0);
      expect(ExitCode.GENERAL_ERROR).toBe(1);
      expect(ExitCode.VALIDATION_ERROR).toBe(2);
      expect(ExitCode.FFMPEG_ERROR).toBe(3);
      expect(ExitCode.FFMPEG_NOT_FOUND).toBe(4);
    });
  });

  describe('ValidationErrorCode', () => {
    it('should have all required error codes', () => {
      const codes: ValidationErrorCode[] = [
        'FILE_NOT_FOUND',
        'INVALID_EXTENSION',
        'FILE_NOT_READABLE',
        'OUTPUT_DIR_NOT_WRITABLE',
        'FFMPEG_NOT_INSTALLED'
      ];

      codes.forEach(code => {
        expect(typeof code).toBe('string');
      });
    });
  });
});
