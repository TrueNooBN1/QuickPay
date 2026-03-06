import { type FC, memo, useMemo } from 'react';
import { useLocation } from 'react-router-dom';

import { useSelector } from '../../services/store/store';
import type { TOrder } from '../../utils/types';
import { getUserData } from '../../services/slices/UserSlice/UserSlice';


export type OrderCardProps = {
  order: TOrder;
};

export const OrderCard: FC<OrderCardProps> = memo(({ order }) => {
  const location = useLocation();

  /** TODO: взять переменную из стора */

  // const orderInfo = useMemo(() => {
  //   if (!ingredients.length) return null;

  //   const ingredientsInfo = order.ingredients.reduce(
  //     (acc: TIngredient[], item: string) => {
  //       const ingredient = ingredients.find((ing) => ing._id === item);
  //       if (ingredient) return [...acc, ingredient];
  //       return acc;
  //     },
  //     []
  //   );

  //   const total = ingredientsInfo.reduce((acc, item) => acc + item.price, 0);

  //   const ingredientsToShow = ingredientsInfo.slice(0, maxIngredients);

  //   const remains =
  //     ingredientsInfo.length > maxIngredients
  //       ? ingredientsInfo.length - maxIngredients
  //       : 0;

  //   const date = new Date(order.createdAt);
  //   return {
  //     ...order,
  //     ingredientsInfo,
  //     ingredientsToShow,
  //     remains,
  //     total,
  //     date
  //   };
  // }, [order, ingredients]);

  if (!order) return null;

  return (
    <section>
      <div>
        <p>Дата заказа</p>
        <p>Кошелек</p>
        <p>Тип сделки</p>
        <p>Сумма сделки</p>
      </div>
    </section>
  );
});
