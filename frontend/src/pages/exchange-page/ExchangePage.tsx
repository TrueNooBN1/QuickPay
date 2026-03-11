// import { Preloader } from '@ui';
// import { FeedUI } from '@ui-pages';
// import { TOrder } from './../../utils/types';
import { useEffect, useState } from 'react';
import type {FC} from "react"
import { useSelector, useDispatch } from '../../services/store/store';
import { useLocation, useNavigate } from 'react-router-dom';
import { Page} from '../Page/Page';
import Button from '../../components/button/button';
import "./ExchangePage.css"
import Input from '../../components/input/input';
import { getRates, rateSelector } from '../../services/slices/RateSlice/RateSlice';
import Preloader from '../../components/preloader/preloader';
import { updateOrder } from '../../services/slices/OrderSlice/OrderSlice';
import { userDataSelector } from '../../services/slices/UserSlice/UserSlice';
import { TOrderType, type TNewOrder } from '../../utils/types';
import RatePresenter from '../../components/rate-presenter/rate-presenter';
import TabButton from '../../components/button/tab-button/tab-button';

export const ExchangePage: FC = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  // console.log("background location" + JSON.stringify(location))


  const rates = useSelector(rateSelector);
  const userData = useSelector(userDataSelector);
  // const orderRequest = useSelector(ordersStatusSelector);  
  
  const [selectedType, setSelectedType] = useState<TOrderType>(TOrderType.Sell);

  const [exchangeValue, setExchangeValue] = useState('');
  const [totalSumValue, setTotalSumValue] = useState('');
  // const [countedValue, setCountedValue] = useState<TExchangePageCalculator>({sellValue: NaN, buyValue:NaN});

  const handleTotalSumValueChange = (newValue: string) => {
    if(newValue.length === 0){
      setTotalSumValue("");
      setExchangeValue("");
      return;
    }
    if(rates){
      setTotalSumValue(newValue);
        if(selectedType === TOrderType.Sell){
          const updatedExchangeValue = Number(newValue) * rates?.rateIn;
          setExchangeValue(updatedExchangeValue.toFixed(2));
        }else if(selectedType === TOrderType.Buy){
          const updatedExchangeValue = Number(newValue) / rates?.rateOut;
          setExchangeValue(updatedExchangeValue.toFixed(2));
        }
    }
  };
  
  const handleExchangeValueChange = (newValue: string) => {
    if(newValue.length === 0){
      setTotalSumValue("");
      setExchangeValue("");
      return;
    }
    if(rates){
      setExchangeValue(newValue);
        if(selectedType === TOrderType.Sell){
          const updatedExchangeValue = Number(newValue) / rates?.rateIn;
          setTotalSumValue(updatedExchangeValue.toFixed(2));
        }else if(selectedType === TOrderType.Buy){
          const updatedExchangeValue = Number(newValue) * rates?.rateOut;
          setTotalSumValue(updatedExchangeValue.toFixed(2));
        }
    }
  };

  const updateType = (type: TOrderType) =>{
    setSelectedType(type)
    setExchangeValue("")
    setTotalSumValue("")
  }

  useEffect(() => {
    dispatch(getRates());
  }, [dispatch]);


  if (!rates) {
    return <Preloader/>
  }

  const onClick =()=>{
    if(exchangeValue.length != 0 && userData){
      navigate("/exchange/create", {
        state: { background: location } // передаём объект, а не строку
      });

      const newOrder:TNewOrder={
        userId: userData?.id,
        exchangeRate: selectedType === TOrderType.Buy ? rates.rateOut : rates.rateIn,
        exchangeValue: Number(exchangeValue),
        phone: userData.phone? userData.phone : "",
        name: userData.name? userData.name : "",
        wallet: userData.wallet? userData.wallet : "",
        type: selectedType,
        totalSum: Number(totalSumValue),
      }
      // console.log(newOrder);
      dispatch(updateOrder(newOrder));
    }
  }



  return (
    <Page>      
      <div className='tabs full-width'>
        <TabButton 
          onClick={()=>{
            updateType(TOrderType.Sell);
          }}
          className={`half-width ${(selectedType === TOrderType.Sell) ? "active" : ""}`}
          >
            Продажа
        </TabButton>      

        <TabButton 
          onClick={()=>{
            updateType(TOrderType.Buy);
          }}
          className={`half-width ${(selectedType === TOrderType.Buy) ? "active" : ""}`}
        >
            Покупка
        </TabButton>      
      </div>

      <RatePresenter 
        className={'full-width'}
        type={selectedType}
        rate={selectedType === TOrderType.Buy?
                  rates.rateOut:
                  rates.rateIn
             }/>

      <Input onValueChange={handleExchangeValueChange} unit={selectedType === TOrderType.Sell ? "Руб." : "USDT"} value={exchangeValue} className='full-width'/>

      <Input onValueChange={handleTotalSumValueChange} unit={selectedType === TOrderType.Buy ? "Руб." : "USDT"} value={totalSumValue} className='full-width'/>

      <Button 
        className={exchangeValue.length === 0 ? "disabled" : ""} 
        onClick={onClick}
      >
        Оформить заявку
      </Button>
      
    </Page>
  );
};
