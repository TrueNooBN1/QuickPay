import { useEffect, useState, type FC } from 'react';
import { Page } from '../Page';
import { OrdersList} from '../../components/orderlist/OrderList';
import Button from '../../components/button/button';
import { useLocation, useNavigate } from 'react-router-dom';
import Text from '../../components/text/text';
import { useSelector } from 'react-redux';
import { getOrders, ordersSelector } from '../../services/slices/OrderSlice/OrderSlice';
// import { getUserData } from '../../services/slices/UserSlice/UserSlice';
import { useDispatch } from '../../services/store/store';
import type { TOrdersFilter } from '../../utils/types';

export const ProfilePage: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [page, setPageValue] = useState<number>(0);
  const filter : TOrdersFilter = {
    pageSize: 10,
    pageNumber: 0
  }
  useEffect(() => {
    // dispatch(getUserData());
    dispatch(getOrders(filter))

  }, [dispatch]);

  const orders = useSelector(ordersSelector);

  return (
  <Page>
        <Button
            onClick={()=>{
              navigate("/profile/edit", {
                state: { background: location } // передаём объект, а не строку
              });}}
            className='full-width'>
      Обновить личную информацию
    </Button>
    <Text>
        Заявки
    </Text>
    
    {orders && <OrdersList orderByDate={orders}>
    </OrdersList>}

    { (orders && (page+1) * filter.pageSize < orders?.total) && 
        <Button onClick={()=>setPageValue(page + 1)}>
          Load More
        </Button>
    }
  </Page>
)};
