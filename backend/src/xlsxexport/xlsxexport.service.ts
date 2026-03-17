import * as ExcelJS from 'exceljs';
import { Injectable } from '@nestjs/common';
import { GetOrderDTO, statusConfig, TOrdersFilter, TOrderStatus, TOrderType, typeConfig } from 'src/order/dto/order.dto';
import { OrderEntity } from 'src/order/entitys/order.entity';
import { Between, FindOptionsWhere, In, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';


const columnsArray = [
      { header: 'ID', key: 'id', width: 20 },
      { header: 'Дата', key: 'createdAt', width: 15 },
      { header: 'Тип сделки', key: 'type', width: 10 },
      { header: 'Имя', key: 'name', width: 30 },
      { header: 'Телефон', key: 'phone', width: 15 },
      { header: 'Кошелек', key: 'wallet', width: 30 },
      { header: 'Статус', key: 'status', width: 10 },
      { header: 'Курс', key: 'exchangeRate', width: 10 },
      { header: 'Курс выполнения', key: 'executionRate', width: 10 },
      { header: 'Сумма обмена', key: 'exchangeValue', width: 15 },
      { header: 'К получению', key: 'totalSum', width: 15 },
      { header: 'Разница по курсам', key: 'diff', width: 15 },
      { header: 'Расчетная прибыль', key: 'summary', width: 15 },
    ];

export const colorsConfig: Record<TOrderStatus, string> = {
  READY: '50c87800',
  CREATED: 'ffdf0000',
  DENIED: 'dc143c00',
};

type TXLSXExportData = {
  id: string;

  userId: string;

  name: string;

  phone: string;

  wallet: string;

  status: string;

  totalSum: number;

  exchangeRate: number;

  exchangeValue: number;

  type: string;

  createdAt: Date;

  executionRate: number;
  
  diff: number;
}

@Injectable()
export class XLSXExportService {

  constructor(
    @InjectRepository(OrderEntity)
    private orderRepository: Repository<OrderEntity>
  ){}


  async getOrderExcel(ordersFilter: TOrdersFilter){
    const where: FindOptionsWhere<OrderEntity> = {};
    if (Array.isArray(ordersFilter.status)){
      if(ordersFilter.status.length > 1){
        where.status = In(ordersFilter.status);
      }else{  
        where.status = ordersFilter.status[0];
      }
    }

    if (ordersFilter.createDateFrom && ordersFilter.createDateTo) {
      where.createdAt = Between(ordersFilter.createDateFrom, ordersFilter.createDateTo);
    } else if (ordersFilter.createDateFrom) {
      where.createdAt = MoreThanOrEqual(ordersFilter.createDateFrom);
    } else if (ordersFilter.createDateTo) {
      where.createdAt = LessThanOrEqual(ordersFilter.createDateTo);
    }
    const [orders, total] = await this.orderRepository.findAndCount({
      where: where,
      order: { createdAt: 'ASC' }
    });

    const items = orders.map(order => this.getOrderXSLXMapperFn()(order));

    console.log(items);
    return await this.generateOrderExcel1(items, ordersFilter);
  }

  async generateOrderExcel(data: TXLSXExportData[]) {
    const workbook = new ExcelJS.Workbook();

    const worksheet = workbook.addWorksheet('Data');
    worksheet.columns = columnsArray;


    data.forEach(item => {
      const xlsxItem = this.getOrderXSLXMapperFn()(item);
      console.log(xlsxItem);
      worksheet.addRow(item);
    });

    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
  }

  private getOrderXSLXMapperFn(): (Order) => TXLSXExportData {

    return (root) => {
      let diff = root?.exchangeRate - root?.executionRate;
      diff *= root?.type === TOrderType.SELL ? -1 : 1;

      return {
        id: root.id,
        userId: root.userId,
        name: root.name,
        phone: root.phone,
        wallet: root.wallet,
        status: root.status,
        totalSum: root.totalSum,
        exchangeRate: root.exchangeRate,  
        exchangeValue: root.exchangeValue,
        type: root.type,
        createdAt: root.createdAt,
        executionRate: root.executionRate ? root.executionRate : null,
        diff: root.executionRate ? diff : null,
      };
    };
  }

  private generateWorksheetKey(type: string, status: string): string{
    return `${type}_${status}`
  }

  async generateOrderExcel1(data: TXLSXExportData[], ordersFilter: TOrdersFilter) {
    const workbook = new ExcelJS.Workbook();

    let workSheetsMap: Map<string, ExcelJS.Worksheet> = new Map();
    let workSheetsTotals: Map<string, {totalExchange, totalSum, totalSummary}> = new Map();
    let workSheetsColor: Map<string, {typeColor, statusColor}> = new Map();

    console.log("here");

    if (Array.isArray(ordersFilter.status)){
      ordersFilter.status.forEach(status => {
        const worksheetBuy = workbook.addWorksheet(`${typeConfig[TOrderType.BUY]}.${statusConfig[status]}`);
        worksheetBuy.columns = columnsArray;
        const buyKey = this.generateWorksheetKey(TOrderType.BUY, status);
        workSheetsMap.set(buyKey, worksheetBuy);
        workSheetsTotals.set(buyKey, {totalExchange:0, totalSum: 0, totalSummary: 0});
        workSheetsColor.set(buyKey, {typeColor: "50c87800", statusColor: colorsConfig[status]});
        
        const worksheetSell = workbook.addWorksheet(`${typeConfig[TOrderType.SELL]}.${statusConfig[status]}`);
        worksheetSell.columns = columnsArray;
        const sellKey = this.generateWorksheetKey(TOrderType.SELL, status);
        workSheetsMap.set(sellKey, worksheetSell);
        workSheetsTotals.set(sellKey, {totalExchange:0, totalSum: 0, totalSummary: 0});
        workSheetsColor.set(sellKey, {typeColor: "dc143c00", statusColor: colorsConfig[status]});
      });
    }


    for(let i = 0; i <  data.length; i+=1){
      const xlsxItem = this.getOrderXSLXMapperFn()(data[i]);
      console.log(xlsxItem);
      const key = this.generateWorksheetKey(xlsxItem.type, xlsxItem.status);
      const workSheetRef = workSheetsMap.get(key);
      let summary = xlsxItem.type === TOrderType.BUY ? xlsxItem.exchangeValue : xlsxItem.totalSum;
      summary *= xlsxItem.diff;
      const insertObj = {
        ...xlsxItem,
        summary: summary,
        type: typeConfig[xlsxItem.type],
        status: statusConfig[xlsxItem.status]
      };
      workSheetRef.addRow(insertObj);
      const totals = workSheetsTotals.get(key);
      workSheetsTotals.set(key, {
        totalExchange: totals.totalExchange += insertObj.exchangeValue,
        totalSum: totals.totalSum += insertObj.totalSum,
        totalSummary: totals.totalSummary += insertObj.summary
      });
    }

    workSheetsMap.forEach((worksheet, key) => {
      const summaryObj = workSheetsTotals.get(key);
      const insertObj = {
        summary: summaryObj.totalSummary,
        exchangeValue: summaryObj.totalExchange,
        totalSum: summaryObj.totalSum
      };
      worksheet.addRow(insertObj);
    });


    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
  }

}