import { Test, TestingModule } from '@nestjs/testing';
import { XLSXExportController } from './xlsxexport.controller';

describe('XlsxexportServiceController', () => {
  let controller: XLSXExportController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [XLSXExportController],
    }).compile();

    controller = module.get<XLSXExportController>(XLSXExportController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
