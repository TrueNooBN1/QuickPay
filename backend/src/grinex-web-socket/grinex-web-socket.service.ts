import { Injectable, OnModuleInit, OnModuleDestroy, Inject, Logger } from '@nestjs/common';
import { AdminDataService } from 'src/admin-data/admin-data.service';
import { OrderService } from 'src/order/order.service';
import * as WebSocket from 'ws';

@Injectable()
export class GrinexWebSocketService implements OnModuleInit, OnModuleDestroy {
  private ws: WebSocket;
  private reconnectAttempts = 0;
  private readonly maxReconnectAttempts = 10;
  private readonly reconnectDelay = 5000; // 5 секунд

  constructor(
      @Inject(AdminDataService)
      private adminDataService: AdminDataService,
    ){}

  onModuleInit() {
    this.connect();
    this.schedulePeriodicReconnect();
  }

  onModuleDestroy() {
    this.disconnect();
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }
  }

  private connect() {
    const url = 'wss://ws.grinex.io/?stream=global&stream=usdtrub&stream=trading_ui_order_book&stream=ext_markets';
    
    this.ws = new WebSocket(url);

    this.ws.on('open', () => {
      console.log('✅ Connected to Grinex WebSocket');
      this.reconnectAttempts = 0; // сбрасываем счетчик при успешном подключении
      
      // Можно отправить подписку, если требуется
      // this.ws.send(JSON.stringify({ action: 'subscribe', stream: 'trading_ui_order_book' }));
    });

    this.ws.on('message', (data: WebSocket.Data) => {
      this.handleMessage(data);
    });

    this.ws.on('error', (error) => {
      console.error('❌ WebSocket error:', error);
    });

    this.ws.on('close', () => {
      console.log('🔌 WebSocket connection closed');
      this.handleReconnect();
    });
  }

  private handleMessage(data: WebSocket.Data) {
    try {
      const rawData = JSON.parse(data.toString());

      const messageKey = Object.keys(rawData)[0];
      const messageData = rawData[messageKey];

      if (messageData?.exchangers) {
        this.processExchangersData(messageData.exchangers);
      }
    } catch (error) {
      console.error('Error parsing WebSocket message:', error);
    }
  }

  private processExchangersData(exchangers: any) {
    // Обрабатываем каждый валютный пэр
    console.log('💼 WebSocket processExchangersData');
    const pairs = [
      'a7a5rub', 'btcrub', 'btcusdt', 'ethrub', 
      'ethusdt', 'usda7a5', 'usdta7a5', 'usdtrub'
    ];
    const newPairs = [
      'usdtrub'
    ];

    console.log('💼 WebSocket processExchangersData');

    newPairs.forEach(pair => {
      if (exchangers[pair]) {
        // console.log(pair, exchangers[pair].ask[0].price);//BUYRATE
        // console.log(pair, exchangers[pair].bid[0].price);//SELLRATE
        this.adminDataService.setRate(exchangers[pair].ask[0].price, exchangers[pair].bid[0].price);//уточнить момент
      }
    });
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`🔄 Reconnecting... Attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
      
      setTimeout(() => {
        this.connect();
      }, this.reconnectDelay);
    } else {
      console.error('❌ Max reconnection attempts reached');
      this.disconnect();
      this.connect();
    }
  }

  private disconnect() {
    if (this.ws) {
      this.ws.close();
    }
  }

  // Публичный метод для отправки сообщений (если нужно)
  sendMessage(message: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    }
  }

  private reconnectTimer: NodeJS.Timeout | null = null;

  private schedulePeriodicReconnect() {
    const intervalMs = 60 * 60 * 1000; // 60 минут в миллисекундах
    
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }
    
    this.reconnectTimer = setTimeout(() => {
      console.log('⏰ Periodic reconnect triggered (60 minutes)');
      this.connect();
    }, intervalMs);
  }
}
