import { type FC } from 'react';
import type { TOrdersData } from '../../utils/types';
import OrderCard from '../ordercard/OrderCard';
import "./OrderList.css"

export type OrdersListProps = {
  orderByDate: TOrdersData;
  onDecline?:(id: string) => void;
  onAccept?: (id: string) => void;
};

export const OrdersList: FC<OrdersListProps> = ({ orderByDate, onDecline = undefined, onAccept = undefined }) => (
  <div className='list-container'>
    {orderByDate.orders.map((order) => (
      <OrderCard order={order} key={order._id} onDecline={onDecline} onAccept={onAccept}/>
    ))}
  </div>
);
