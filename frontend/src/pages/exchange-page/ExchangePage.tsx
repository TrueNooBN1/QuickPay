// import { Preloader } from '@ui';
// import { FeedUI } from '@ui-pages';
// import { TOrder } from './../../utils/types';
import { useEffect, useState } from 'react';
import type {FC} from "react"
import { useSelector, useDispatch } from '../../services/store/store';
import { useNavigate } from 'react-router-dom';
import { Page} from '../Page/Page';
import Button from '../../components/button/button';
import "./ExchangePage.css"
import Text from '../../components/text/text';
import Input from '../../components/input/input';
import { getRates, rateSelector } from '../../services/slices/RateSlice/RateSlice';
import Preloader from '../../components/preloader/preloader';


export const ExchangePage: FC = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate()
  
  useEffect(() => {
    dispatch(getRates());
  }, [dispatch]);
  
  
  const rates = useSelector(rateSelector);
  
  const [selectedType, setSelectedType] = useState(0);

  const [inputValue, setInputValue] = useState('');
  const [countedValue, setCountedValue] = useState(NaN);
  

  const handleValueChange = (newValue: string) => {
    setInputValue(newValue);
    setCountedValue(Number(newValue));
  };

  if (!rates) {
    return <Preloader/>
  }

  return (
    <Page>
      
      <div className='container'>
        <Button 
          onClick={()=>{
            setSelectedType(0)
            setInputValue("");
          }}
          className={(selectedType === 0) ? "button-checked" : ""}
        >
            Покупка
        </Button>      

        <Button 
          onClick={()=>{
            setSelectedType(1)
            setInputValue("");
          }}
          className={(selectedType === 1) ? "button-checked" : ""}
          >
            Продажа
        </Button>      
      </div>

      <div>
        <Text>
          {
            selectedType === 0 ? 
              `Покупка 1₮ за ${rates.rateIn}₽` :
              `Продажа ${rates.rateOut}₽ за 1₮`
          }
        </Text>
        <Text>
          Введите сумму для обмена
        </Text>
        <Input onValueChange={handleValueChange} unit={selectedType === 0 ? "₽" : "₮"} value={inputValue}></Input>

        {selectedType === 0 ?
          <Text>
            {inputValue.length === 0 ? "" : `Вы получите ${(countedValue/rates.rateOut).toFixed(2)} ₮`}
            {/* {`Вы получите ${(countedValue/rates.rateOut).toFixed(2)} ₮`} */}
          </Text>
         :
          <Text>
            {inputValue.length === 0 ? "" : `Вы получите ${(countedValue * rates.rateIn).toFixed(2)} ₽`}
            {/* {`Вы получите ${(countedValue * rates.rateIn).toFixed(2)} ₽`} */}
          </Text>
        }
      </div>
      <Button onClick={()=>navigate("/")}>
        Оформить заявку
      </Button>

    </Page>
  );
};
