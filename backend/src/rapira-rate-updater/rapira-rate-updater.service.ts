import { Injectable, OnModuleInit, OnModuleDestroy, Inject, Logger } from '@nestjs/common';
import { AdminDataService } from 'src/admin-data/admin-data.service';
import { HttpService } from '@nestjs/axios';
import { interval } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

type TParsedRate = {
    rateIn: number,
    rateOut: number
}

@Injectable()
export class RapiraRateUpdaterService {


    constructor(
        @Inject(AdminDataService)
        private adminDataService: AdminDataService,
        private readonly httpService: HttpService,
    ) {}

  async onModuleInit() {
    // Запуск таймера раз в 5 секунд
    interval(5000).subscribe(async () => {
      try {
        // Выполняем HTTP-запрос
        const response = await this.httpService.get('https://api.rapira.net/open/market/rates').toPromise();
        
        // Парсим ответ
        const parsedData = this.parseResponse(response.data);
        
        // Обрабатываем данные (ваша логика)
        await this.processData(parsedData);
        // console.log("try request");
      } catch (error) {
        console.error('Ошибка при запросе или парсинге:', error);
      }
    });
  }

  // Метод для парсинга ответа
  private parseResponse(data: any): TParsedRate  {
    // Замените на вашу логику парсинга

    let rates: TParsedRate = {rateIn: null, rateOut: null};
    data.data.forEach(element => {
        if(element['symbol'] === 'USDT/RUB'){
            // console.log('Price', element)
            rates.rateIn = element['askPrice'];
            rates.rateOut = element['bidPrice'];
            return rates
        }        
    });

    return rates;
  }

  // Метод для обработки данных
  private async processData(rates: TParsedRate): Promise<void> {
    // Замените на вашу логику обработки
    // console.log('Обработанные данные:', data);
    this.adminDataService.setRate(rates.rateIn, rates.rateOut);
  }
}

