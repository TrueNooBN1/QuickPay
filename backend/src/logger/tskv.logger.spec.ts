import { TSKVLogger } from './tskv.logger';

describe('TSKVlogger', () => {
  let tskvLogger: TSKVLogger;
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    tskvLogger = new TSKVLogger();
    consoleSpy = jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  describe('TSKV Logger Tests', () => {
    it('check message string', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      tskvLogger.log('test message');
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('test message'),
      );
    });

    it('check jsonFormat', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      tskvLogger.log('test message', 'testCase', 'testCase1');
      const output = consoleSpy.mock.calls[0][0];

      expect(output).toEqual(
        `level=log\tmessage=test message\toptionalParams=[["testCase","testCase1"]]\n`,
      );
    });
  });
});
