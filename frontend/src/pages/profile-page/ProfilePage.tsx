import type { FC } from 'react';
// import { useNavigate } from 'react-router-dom';
import { Page } from '../Page';
import type { TOrder } from '../../utils/types';
import { OrdersList, type OrdersListProps } from '../../components/orderlist/OrderList';
import OrderForm from '../../forms/OrderForm/OrderForm';

export const ProfilePage: FC = () => {
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

  return (
  <Page>
    <OrderForm/>
    <h2>
        Заявки
    </h2>
    <OrdersList orderByDate={orders}>
    </OrdersList>
  </Page>
)};
