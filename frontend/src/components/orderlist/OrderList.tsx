import { type FC } from 'react';
import type { TOrder } from '../../utils/types';
import OrderCard from '../ordercard/OrderCard';
import "./OrderList.css"

export type OrdersListProps = {
  orderByDate: TOrder[];
  onDecline?:(id: string) => void;
  onAccept?: (id: string) => void;
};


export const OrdersList: FC<OrdersListProps> = ({ orderByDate, onDecline = undefined, onAccept = undefined }) => (
  <div className='list-container'>
    {orderByDate.map((order) => (
      <OrderCard order={order} key={order._id} onDecline={onDecline} onAccept={onAccept}/>
    ))}
  </div>
);
