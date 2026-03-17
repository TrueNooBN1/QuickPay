import { Test, TestingModule } from '@nestjs/testing';
import { XLSXExportService } from './xlsxexport.service';

describe('XlsxexportServiceService', () => {
  let service: XLSXExportService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [XLSXExportService],
    }).compile();

    service = module.get<XLSXExportService>(XLSXExportService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
