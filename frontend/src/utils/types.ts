export type TOrder = {
  _id: string;
  userId: string;
  name: string;
  amount: string;
  type: OrderType;
  createdAt: string;
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

export type OrderType = 'Sell' | 'Buy';