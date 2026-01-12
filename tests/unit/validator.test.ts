import * as fs from 'fs';
import * as path from 'path';
import { validateInput, validateOutputDir } from '../../src/validator';

jest.mock('fs');

const mockFs = fs as jest.Mocked<typeof fs>;

describe('validator', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('validateInput', () => {
    const validMovPath = '/path/to/video.mov';

    it('should return valid for existing .mov file', () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.accessSync.mockImplementation(() => undefined);

      const result = validateInput(validMovPath);

      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should return FILE_NOT_FOUND error for non-existent file', () => {
      mockFs.existsSync.mockReturnValue(false);

      const result = validateInput(validMovPath);

      expect(result.valid).toBe(false);
      expect(result.error?.code).toBe('FILE_NOT_FOUND');
      expect(result.error?.message).toContain('does not exist');
    });

    it('should return INVALID_EXTENSION error for non-.mov file', () => {
      mockFs.existsSync.mockReturnValue(true);

      const result = validateInput('/path/to/video.mp4');

      expect(result.valid).toBe(false);
      expect(result.error?.code).toBe('INVALID_EXTENSION');
      expect(result.error?.message).toContain('.mov');
    });

    it('should return FILE_NOT_READABLE error when file is not readable', () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.accessSync.mockImplementation(() => {
        throw new Error('EACCES: permission denied');
      });

      const result = validateInput(validMovPath);

      expect(result.valid).toBe(false);
      expect(result.error?.code).toBe('FILE_NOT_READABLE');
      expect(result.error?.message).toContain('not readable');
    });

    it('should handle case-insensitive .MOV extension', () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.accessSync.mockImplementation(() => undefined);

      const result = validateInput('/path/to/video.MOV');

      expect(result.valid).toBe(true);
    });

    it('should resolve relative paths to absolute paths', () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.accessSync.mockImplementation(() => undefined);

      const result = validateInput('relative/video.mov');

      expect(result.valid).toBe(true);
      expect(result.resolvedPath).toContain('relative/video.mov');
      expect(path.isAbsolute(result.resolvedPath!)).toBe(true);
    });
  });

  describe('validateOutputDir', () => {
    it('should return valid when output directory is writable', () => {
      mockFs.accessSync.mockImplementation(() => undefined);

      const result = validateOutputDir('/path/to/output.mp4');

      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should return OUTPUT_DIR_NOT_WRITABLE error when directory is not writable', () => {
      mockFs.accessSync.mockImplementation(() => {
        throw new Error('EACCES: permission denied');
      });

      const result = validateOutputDir('/path/to/output.mp4');

      expect(result.valid).toBe(false);
      expect(result.error?.code).toBe('OUTPUT_DIR_NOT_WRITABLE');
      expect(result.error?.message).toContain('not writable');
    });
  });
});
