import { spawn } from 'child_process';
import { EventEmitter } from 'events';
import { convert, getDefaultOutputPath } from '../../src/converter';
import { ConversionOptions } from '../../src/types';

jest.mock('child_process');
jest.mock('fs', () => ({
  ...jest.requireActual('fs'),
  statSync: jest.fn().mockReturnValue({ size: 1000000 })
}));

const mockSpawn = spawn as jest.MockedFunction<typeof spawn>;

describe('converter', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getDefaultOutputPath', () => {
    it('should replace .mov extension with .mp4', () => {
      expect(getDefaultOutputPath('/path/to/video.mov')).toBe('/path/to/video.mp4');
    });

    it('should handle .MOV extension (case-insensitive)', () => {
      expect(getDefaultOutputPath('/path/to/video.MOV')).toBe('/path/to/video.mp4');
    });

    it('should preserve directory path', () => {
      expect(getDefaultOutputPath('/some/dir/my-video.mov')).toBe('/some/dir/my-video.mp4');
    });
  });

  describe('convert', () => {
    const createMockProcess = (): EventEmitter & { stdout: EventEmitter; stderr: EventEmitter } => {
      const proc = new EventEmitter() as EventEmitter & { stdout: EventEmitter; stderr: EventEmitter };
      proc.stdout = new EventEmitter();
      proc.stderr = new EventEmitter();
      return proc;
    };

    it('should spawn ffmpeg with correct arguments for basic conversion', async () => {
      const mockProcess = createMockProcess();
      mockSpawn.mockReturnValue(mockProcess as any);

      const options: ConversionOptions = {
        inputPath: '/path/to/input.mov',
        outputPath: '/path/to/output.mp4',
        quality: 'medium'
      };

      const convertPromise = convert(options);

      // Simulate successful completion
      setTimeout(() => {
        mockProcess.emit('close', 0);
      }, 10);

      await convertPromise;

      expect(mockSpawn).toHaveBeenCalledWith(
        'ffmpeg',
        expect.arrayContaining([
          '-i', '/path/to/input.mov',
          '-c:v', 'libx264',
          '-crf', '23',
          '-preset', 'medium',
          '-c:a', 'aac',
          '-b:a', '128k',
          '-y',
          '/path/to/output.mp4'
        ])
      );
    });

    it('should reject when ffmpeg exits with non-zero code', async () => {
      const mockProcess = createMockProcess();
      mockSpawn.mockReturnValue(mockProcess as any);

      const options: ConversionOptions = {
        inputPath: '/path/to/input.mov',
        outputPath: '/path/to/output.mp4',
        quality: 'medium'
      };

      const convertPromise = convert(options);

      setTimeout(() => {
        mockProcess.emit('close', 1);
      }, 10);

      await expect(convertPromise).rejects.toThrow('FFmpeg exited with code 1');
    });

    it('should reject when ffmpeg process errors', async () => {
      const mockProcess = createMockProcess();
      mockSpawn.mockReturnValue(mockProcess as any);

      const options: ConversionOptions = {
        inputPath: '/path/to/input.mov',
        outputPath: '/path/to/output.mp4',
        quality: 'medium'
      };

      const convertPromise = convert(options);

      setTimeout(() => {
        mockProcess.emit('error', new Error('spawn ffmpeg ENOENT'));
      }, 10);

      await expect(convertPromise).rejects.toThrow('spawn ffmpeg ENOENT');
    });

    it('should call onProgress callback with progress data from stderr', async () => {
      const mockProcess = createMockProcess();
      mockSpawn.mockReturnValue(mockProcess as any);

      const onProgress = jest.fn();
      const options: ConversionOptions = {
        inputPath: '/path/to/input.mov',
        outputPath: '/path/to/output.mp4',
        quality: 'medium'
      };

      const convertPromise = convert(options, 60, onProgress);

      // Simulate stderr output with progress
      setTimeout(() => {
        mockProcess.stderr.emit('data', Buffer.from('frame=  100 fps= 30 time=00:00:30.00 bitrate= 500kbits/s'));
      }, 5);

      setTimeout(() => {
        mockProcess.emit('close', 0);
      }, 15);

      await convertPromise;

      expect(onProgress).toHaveBeenCalled();
    });

    it('should use CRF 28 for low quality', async () => {
      const mockProcess = createMockProcess();
      mockSpawn.mockReturnValue(mockProcess as any);

      const options: ConversionOptions = {
        inputPath: '/path/to/input.mov',
        outputPath: '/path/to/output.mp4',
        quality: 'low'
      };

      const convertPromise = convert(options);

      setTimeout(() => {
        mockProcess.emit('close', 0);
      }, 10);

      await convertPromise;

      expect(mockSpawn).toHaveBeenCalledWith(
        'ffmpeg',
        expect.arrayContaining(['-crf', '28'])
      );
    });

    it('should use CRF 18 for high quality', async () => {
      const mockProcess = createMockProcess();
      mockSpawn.mockReturnValue(mockProcess as any);

      const options: ConversionOptions = {
        inputPath: '/path/to/input.mov',
        outputPath: '/path/to/output.mp4',
        quality: 'high'
      };

      const convertPromise = convert(options);

      setTimeout(() => {
        mockProcess.emit('close', 0);
      }, 10);

      await convertPromise;

      expect(mockSpawn).toHaveBeenCalledWith(
        'ffmpeg',
        expect.arrayContaining(['-crf', '18'])
      );
    });
  });
});
