// components/Button/Button.tsx
import type { FC } from 'react';
import './rate-presenter.css'; // общие стили для всех страниц
import Text from '../text/text';
import "./rate-presenter.css";

export interface RatePresenterProps {
  rate: number;
  header: string;
  rateStringConverterFunc?: ((value: number) => string) | null;
  className?: string;
}

const RatePresenter: FC<RatePresenterProps> = ({ 
  rate,
  header,
  rateStringConverterFunc = null,
  className = '' 
}) => {
  return (
    <div className='rate-container'>
      <h3>{header}</h3>
  
      {typeof rateStringConverterFunc === 'function' ? (
        <Text className={`formatted-text + ${className}`}>
          {rateStringConverterFunc(rate)}
        </Text>
      ) : (
        <Text>
          {rate}
        </Text>
      )}  

    </div>
  );
};

export default RatePresenter;