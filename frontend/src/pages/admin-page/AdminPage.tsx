import { useEffect, useState, type FC } from 'react';
// import { useNavigate } from 'react-router-dom';
import { Page } from '../Page';
import { type TOrdersFilter } from '../../utils/types';
import { OrdersList} from '../../components/orderlist/OrderList';
import { useSelector } from 'react-redux';
import { getOrders, ordersSelector } from '../../services/slices/OrderSlice/OrderSlice';
import Input from '../../components/input/input';
import TextInput from '../../components/input/text-input';
import Text from '../../components/text/text';
import { useDispatch } from '../../services/store/store';
import Button from '../../components/button/button';

export const AdminPage: FC = () => {
//   const navigate = useNavigate();

  const dispatch = useDispatch();  
  const orders = useSelector(ordersSelector);
  const [commission, setCommissionValue] = useState<string>();
  const [wallet, setWalletValue] = useState<string>();
  const [page, setPageValue] = useState<number>(0);

  const onAccept = (id: string) => {
    console.log(`accept ${id}`);
  }
  const onDecline = (id: string) => {
    console.log(`decline ${id}`);
  }
  const handleCommissionChange = (newValue: string) => {
    setCommissionValue(newValue);
  };
  const handleWalletChange = (newValue: string) => {
    setWalletValue(newValue);
  };

  const filter: TOrdersFilter = {
    pageNumber: 0,
    pageSize: 10,
  }

  useEffect(()=>{
    dispatch(getOrders(filter));
  }, [dispatch]);

  return (
  <Page>
    <Text>
      Установить комиссию(%)
    </Text>
    <Input
     onValueChange={handleCommissionChange}
     unit={"%"}
     value={commission}
     className='full-width'
     placeholder='Установите комиссию'/>
    <Button onClick={()=>{}}>
      Сохранить
    </Button>


    <Text>
      Установить кошелек для покупки
    </Text>
    <TextInput
     onValueChange={handleWalletChange}
     unit={""}
     value={wallet}
     className='full-width'
     placeholder='Установите кошелек'/>
     <Button onClick={()=>{}}>
      Сохранить
     </Button>

    <Text>
      Установить фильтр для заявок
    </Text>
     <Button onClick={()=>{}}>
      Применить
     </Button>
    

    
    {orders && <OrdersList orderByDate={orders} onAccept={onAccept} onDecline={onDecline}>
    </OrdersList>}
    { (orders && (page+1) * filter.pageSize < orders?.total) && 
        <Button onClick={()=>setPageValue(page + 1)}>
          Load More
        </Button>
    }
  </Page>
)};
