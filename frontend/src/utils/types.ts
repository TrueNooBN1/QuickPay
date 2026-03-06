export type TOrderStatus = "created" | "ready" | "denied"; // или используйте enum

export type TOrder = {
  _id: string;
  userId: string;
  name: string;
  wallet: string,
  status: TOrderStatus,
  amount: number;
  type: TOrderType;
  createdAt: string;
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

export type TUserInfo = {
  wallet: string;
  name: string;
  phoneNumber: string;
}

export type TUser = {
  _id: string;
  telegramId: string;
  userData: TUserInfo;
};

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

export type TOrderType = 'Sell' | 'Buy';