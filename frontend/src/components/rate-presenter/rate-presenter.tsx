// components/Button/Button.tsx
import type { FC } from 'react';
import './rate-presenter.css'; // общие стили для всех страниц
import { TOrderType } from '../../utils/types';

export interface RatePresenterProps {
  rate: number;
  type: TOrderType;
  className?: string;
}

/**
 * 
 * @param rate Курс валюты (например, 76.56 для USDT/RUB, если rate < 0 будет выоводится шаблонная строка о невозможности провести операцию)
 * @param type Тип операции (buy/sell) - определяет направление расчета
 * @param className CSS класс для стилизации элемента
 * @returns 
 */

const RatePresenter: FC<RatePresenterProps> = ({ 
  rate,
  type,
  className 
}) => {
  return (
    <div className={`rate-container ${className}`}>
      <h3 className='rate-presenter-header'>
        {type === TOrderType.Buy ? 'Покупка': 'Продажа'}
      </h3>
      <div className='rate-presenter-currency'>
        USDT
      </div>
      <div className='rate-presenter-rate'>
        {rate > 0 ? `${rate} Руб.` : `-`}
      </div>

    </div>
  );
};

export default RatePresenter;