import { JsonLogger } from './json.logger';

describe('JsonLogger', () => {
  let jsonLogger: JsonLogger;
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    jsonLogger = new JsonLogger();
    consoleSpy = jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  describe('Json Logger Tests', () => {
    it('check message string', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      jsonLogger.log(
        'test message',
        { param1: 'testCase' },
        { param2: 'testCase1' },
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('test message'),
      );
    });

    it('check jsonFormat', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      jsonLogger.log('test message', 'testCase');
      const output = consoleSpy.mock.calls[0][0];
      const parsed = JSON.parse(output);

      expect(parsed).toEqual({
        level: 'log',
        message: 'test message',
        optionalParams: [['testCase']],
      });
    });

    it('check jsonFormat with multi argument ', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      jsonLogger.log(
        'test message',
        { param1: 'testCase' },
        { param2: 'testCase1' },
      );
      const output = consoleSpy.mock.calls[0][0];
      const parsed = JSON.parse(output);

      expect(parsed).toEqual({
        level: 'log',
        message: 'test message',
        optionalParams: [[{ param1: 'testCase' }, { param2: 'testCase1' }]],
      });
    });
  });
});
