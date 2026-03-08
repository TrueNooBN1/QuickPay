
export type TOrder = TNewOrder & {
  _id: string;
  status: TOrderStatus,
  createdAt: string;
};

export type TNewOrder = {
  userId: string;
  name: string;
  phone: string;
  wallet: string,
  exchangeRate: number;
  exchangeValue: number;
  totalSum: number;
  type: TOrderType;
};

// Маппинг статусов для отображения
export const statusConfig: Record<TOrderStatus, { label: string; className: string }> = {
  created: { label: 'Создан', className: 'status-created' },
  ready: { label: 'Выполнен', className: 'status-completed' },
  denied: { label: 'Отменен', className: 'status-cancelled' },
};

export type TOrdersData = {
  orders: TOrder[];
  total: number;
};

export type TUser = {
  id: string;
  // telegramId: string;
  wallet?: string;
  name?: string;
  phone?: string;
  roles: string[];
};

export type TUpdateUserData = {
  wallet?: string;
  name?: string;
  phone?: string;
}

export type TRate = {
  rateIn: number;
  rateOut: number;
};

export const ReqStatus = {
  Idle: 'Idle',
  Loading: 'Loading',
  Success: 'Success',
  Failed: 'Failed'
} as const;

export type ReqStatus = typeof ReqStatus[keyof typeof ReqStatus];

// export type TOrderType = 'Sell' | 'Buy';

export const TOrderType = {
  Sell: 'SELL',
  Buy: 'BUY',
} as const;

export type TOrderType = typeof TOrderType[keyof typeof TOrderType];


// export type TOrderStatus = "created" | "ready" | "denied"; // или используйте enum
export const TOrderStatus = {
  created: 'created',
  ready: 'ready',
  denied: 'denied',
} as const;
export type TOrderStatus = typeof TOrderStatus[keyof typeof TOrderStatus];
