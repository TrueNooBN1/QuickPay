import { Injectable, OnModuleInit, OnModuleDestroy, Inject } from '@nestjs/common';
import { OrderService } from 'src/order/order.service';
import * as WebSocket from 'ws';

@Injectable()
export class GrinexWebSocketService implements OnModuleInit, OnModuleDestroy {
  private ws: WebSocket;
  private reconnectAttempts = 0;
  private readonly maxReconnectAttempts = 5;
  private readonly reconnectDelay = 5000; // 5 секунд

  constructor(@Inject(OrderService)
      private orderRepository: OrderService){}

  onModuleInit() {
    this.connect();
  }

  onModuleDestroy() {
    this.disconnect();
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
      // console.log('📥 Received data:', rawData);

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
    const pairs = [
      'a7a5rub', 'btcrub', 'btcusdt', 'ethrub', 
      'ethusdt', 'usda7a5', 'usdta7a5', 'usdtrub'
    ];
    const newPairs = [
      'usdta7a5'
    ];

    newPairs.forEach(pair => {
      if (exchangers[pair]) {
        // console.log(`📊 ${pair}:`, {
        //   asksCount: exchangers[pair].ask?.length || 0,
        //   bidsCount: exchangers[pair].bid?.length || 0,
        //   price: exchangers[pair].price
        // });

        // Здесь можно сохранять данные в базу или отправлять через EventEmitter
        this.orderRepository.setRate(exchangers[pair].price.usdta7a5, exchangers[pair].price.a7a5usdt);//уточнить момент
      }
    });
  }

  private saveOrderBookData(pair: string, data: any) {
    // Сохраняем в базу данных или отправляем клиентам
    // Например, через EventEmitter:
    // this.eventEmitter.emit('orderbook.update', { pair, data });
    
    // Или сохраняем в Redis для быстрого доступа
    // this.redisClient.set(`orderbook:${pair}`, JSON.stringify(data));

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
}