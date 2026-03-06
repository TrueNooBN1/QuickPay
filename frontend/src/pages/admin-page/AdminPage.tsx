import type { FC } from 'react';
// import { useNavigate } from 'react-router-dom';
import { Page } from '../Page';
import type { TOrder } from '../../utils/types';
import { OrdersList} from '../../components/orderlist/OrderList';
import OrderForm from '../../forms/OrderForm/OrderForm';

export const AdminPage: FC = () => {
//   const navigate = useNavigate();
  
  const orders: TOrder[] = [{
    _id: "1",
    amount: 100,
    createdAt: new Date().toISOString(),
    name: "userName",
    status: 'created',
    type: 'Buy',
    userId: "2",
    wallet: "walletString"
  },{
    _id: "2",
    amount: 1000,
    createdAt: new Date().toISOString(),
    name: "userName",
    status: 'created',
    type: 'Sell',
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
