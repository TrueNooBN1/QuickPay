import { Body, Controller, ForbiddenException, Post, Res, StreamableFile, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { XLSXExportService } from './xlsxexport.service';
import { User } from 'src/decorators/user.decorator';
import { TOrdersFilter } from 'src/order/dto/order.dto';
import { UserRole } from 'src/tg_user/dto/get-user.dto';
import { Readable } from 'typeorm/platform/PlatformTools';
import { Response } from 'express';

@Controller('xlsxexport')
@UseGuards(JwtAuthGuard)
export class XLSXExportController {
  constructor(
    private readonly xlsxExportService: XLSXExportService,
  ){}

  @Post()
  async export(
        @Body() body: TOrdersFilter,
        @User() user,
        @Res() res: Response
  ){
    const isAdmin = user.roles.indexOf(UserRole.ADMIN) !== - 1;
    if(!isAdmin)
      throw new ForbiddenException("Недостаточно прав");
    
    try {
          const buffer = await this.xlsxExportService.getOrderExcel(body);
          
          res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
          res.setHeader('Content-Disposition', 'attachment; filename=orders.xlsx');
          res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition'); // ВАЖНО для CORS
          
          res.send(buffer);
        } catch (error) {
          res.status(500).json({ message: error.message });
        }
    }
}
