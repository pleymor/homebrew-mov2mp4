import { checkFfmpeg, getInstallInstructions } from '../../src/ffmpeg-check';
import { spawn } from 'child_process';

jest.mock('child_process');

const mockSpawn = spawn as jest.MockedFunction<typeof spawn>;

describe('ffmpeg-check', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('checkFfmpeg', () => {
    it('should return installed: true when ffmpeg is found', async () => {
      const mockProcess = {
        stdout: {
          on: jest.fn((event, callback) => {
            if (event === 'data') {
              callback(Buffer.from('ffmpeg version 6.1.1'));
            }
          })
        },
        stderr: { on: jest.fn() },
        on: jest.fn((event, callback) => {
          if (event === 'close') {
            callback(0);
          }
        })
      };

      mockSpawn.mockReturnValue(mockProcess as any);

      const result = await checkFfmpeg();

      expect(result.installed).toBe(true);
      expect(result.version).toContain('6.1.1');
    });

    it('should return installed: false when ffmpeg is not found', async () => {
      const mockProcess = {
        stdout: { on: jest.fn() },
        stderr: { on: jest.fn() },
        on: jest.fn((event, callback) => {
          if (event === 'error') {
            callback(new Error('spawn ffmpeg ENOENT'));
          }
        })
      };

      mockSpawn.mockReturnValue(mockProcess as any);

      const result = await checkFfmpeg();

      expect(result.installed).toBe(false);
    });

    it('should return installed: false when ffmpeg exits with non-zero code', async () => {
      const mockProcess = {
        stdout: { on: jest.fn() },
        stderr: { on: jest.fn() },
        on: jest.fn((event, callback) => {
          if (event === 'close') {
            callback(1);
          }
        })
      };

      mockSpawn.mockReturnValue(mockProcess as any);

      const result = await checkFfmpeg();

      expect(result.installed).toBe(false);
    });
  });

  describe('getInstallInstructions', () => {
    it('should return macOS installation instructions', () => {
      const instructions = getInstallInstructions();

      expect(instructions).toContain('FFmpeg is not installed');
      expect(instructions).toContain('brew install ffmpeg');
      expect(instructions).toContain('Homebrew');
    });

    it('should include MacPorts as alternative', () => {
      const instructions = getInstallInstructions();

      expect(instructions).toContain('MacPorts');
      expect(instructions).toContain('sudo port install ffmpeg');
    });
  });
});
