// components/Button/Button.tsx
import type { FC } from 'react';
import './rate-presenter.css'; // общие стили для всех страниц
import Text from '../text/text';
import "./rate-presenter.css";
import { TOrderType } from '../../utils/types';

export interface RatePresenterProps {
  rate: number;
  type: TOrderType;
  className?: string;
}

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
        {`${rate} Руб.`}
      </div>

    </div>
  );
};

export default RatePresenter;