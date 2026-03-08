import type { FC } from 'react';
// import { useNavigate } from 'react-router-dom';
import { Page } from '../Page';
import { TOrderType, type TOrder } from '../../utils/types';
import { OrdersList} from '../../components/orderlist/OrderList';

export const AdminPage: FC = () => {
//   const navigate = useNavigate();
  
  const orders: TOrder[] = [{
    _id: "1",
    exchangeRate: 100,
    exchangeValue: 100,
    totalSum: 100,
    createdAt: new Date().toISOString(),
    name: "userName",
    status: 'created',
    type: TOrderType.Buy,
    phone: "983213821",
    userId: "2",
    wallet: "walletString"
  },{
    _id: "2",
    exchangeRate: 1000,
    exchangeValue: 1000,
    totalSum: 1000,
    createdAt: new Date().toISOString(),
    name: "userName",
    status: 'created',
    type: TOrderType.Sell,
    phone: "983213821",
    userId: "2",
    wallet: "walletString"
  },
  ];

  const onAccept = (id: string) => {
    console.log(`accept ${id}`);
  }
  const onDecline = (id: string) => {
    console.log(`decline ${id}`);
  }

  return (
  <Page>
    <div>
      Установить комиссию(%)
    </div>
    <div>
      Установить кошелек для покупки
    </div>
    <div>
      Установить фильтр для заявок
    </div>
    <OrdersList orderByDate={orders} onAccept={onAccept} onDecline={onDecline}>
    </OrdersList>
  </Page>
)};
