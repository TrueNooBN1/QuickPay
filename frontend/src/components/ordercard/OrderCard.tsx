// components/ExchangeCard/ExchangeCard.tsx
import React from 'react';
import './OrderCard.css';
import { statusConfig, TOrderType, type TOrder } from '../../utils/types';
import SecondaryButton from '../button/secondary-button/secondary-button';
// import Button from '../button/button';

export type OrderStatus = 0 | 1 | 2 | 3 | 4; // или используйте enum

export interface OrderCardProps {
  order: TOrder;
  /** Обработчик клика по карточке */
  onAccept?: (id: string) => void | undefined;
  onDecline?: (id: string) => void | undefined;
  /** Дополнительный класс */
  className?: string;
}


const OrderCard: React.FC<OrderCardProps> = ({
  order,
  onAccept = undefined,
  onDecline = undefined,
  className = '',
}) => {
  // Форматирование адреса кошелька (показываем первые и последние символы)

  const formatWallet = (wallet: string) => {
    return wallet;
    if (wallet.length <= 12) return wallet;
    return `${wallet.slice(0, 6)}...${wallet.slice(-4)}`;
  };

  // console.log("OOOOOOOOOORDER", order.id);
  // console.log("OOOOOOOOOORDER", order.name);

  // Форматирование суммы
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('ru-RU', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  // Определяем класс для типа операции
  const typeClass = order.type.toLowerCase() === 'buy' ? 'type-buy' : 'type-sell';
  const typeLabel = order.type.toLowerCase() === 'buy' ? 'Покупка' : 'Продажа';

  // Получаем конфигурацию статуса
  const statusInfo = statusConfig[order.status] || statusConfig["CREATED"];

  // Форматирование даты
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div
      className={`order-card ${className}`}
    >
      <div className="order-card__header">
        <span className={`order-card__type ${typeClass}`}>
          {typeLabel}
        </span>
        <span className={`order-card__status ${statusInfo.className}`}>
          {statusInfo.label}
        </span>
      </div>

      <div className="order-card__body">
        <div className="order-card__row">
          <span className="order-card__label">Кошелек:</span>
          <span className="order-card__wallet" title={order.wallet}>
            {formatWallet(order.wallet)}
          </span>
        </div>


        {onAccept && <div className="order-card__row">
          <span className="order-card__label">ФИО:</span>
          <span className="order-card__amount">
            {order.name}
          </span>
        </div>}

        {onAccept && <div className="order-card__row">
          <span className="order-card__label">Телефон:</span>
          <span className="order-card__amount">
            {order.phone}
          </span>
        </div>}

        <div className="order-card__info-row">
          <div className="order-card__info-column">
            <span className="order-card__label">Сумма обмена:</span>
            <span className="order-card__amount">
              {`${formatAmount(order.exchangeValue)} ${order.type === TOrderType.Sell? "Руб": "USDT"}`}
            </span>
          </div>
          <div className="order-card__info-column">
            <span className="order-card__label">Курс:</span>
            <span className="order-card__amount">
              {`${formatAmount(order.exchangeRate)} Руб.`}
            </span>
          </div>
          <div className="order-card__info-column">
            <span className="order-card__label">Сумма к получению:</span>
            <span className="order-card__amount">
              {`${formatAmount(order.totalSum)} ${order.type === TOrderType.Buy? "Руб": "USDT"}`}
            </span>
          </div>
        </div>

        {order.createdAt && (
          <div className="order-card__row">
            <span className="order-card__label">Дата:</span>
            <span className="order-card__date">
              {formatDate(order.createdAt)}
            </span>
          </div>
        )}
      </div>
      

      <div className="order-card__footer">
        {onAccept && (
          <SecondaryButton  onClick={()=>onAccept(order.id)}>
            <span className="order-card__details">Подтвердить выполнение</span>
          </SecondaryButton>
        )}
        
        {onDecline && (
          <SecondaryButton onClick={()=>onDecline(order.id)}>
            <span className="order-card__details">Отменить</span>
          </SecondaryButton>
        )}
      </div>

    </div>
  );
};

export default OrderCard;