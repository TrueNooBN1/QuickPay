import { useEffect, useRef, type FC } from 'react';
import { Page } from '../Page';
import { OrdersList} from '../../components/orderlist/OrderList';
import Button from '../../components/button/button';
import { useLocation, useNavigate } from 'react-router-dom';
import Text from '../../components/text/text';
import { useSelector } from 'react-redux';
import { ordersFilterSelector, getOrders, ordersSelector, resetOrdersFilterUserState, updateFilter } from '../../services/slices/OrderSlice/OrderSlice';
// import { getUserData } from '../../services/slices/UserSlice/UserSlice';
import { useDispatch } from '../../services/store/store';
import SecondaryButton from '../../components/button/secondary-button/secondary-button';

export const ProfilePage: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const filter = useSelector(ordersFilterSelector);
  const orders = useSelector(ordersSelector);
  const ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    dispatch(resetOrdersFilterUserState())
    // dispatch(getOrders(filter))
  }, [dispatch]);

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest'
      });
    }
    dispatch(getOrders(filter));
  }, [filter]);


  
  return (
    <Page>
      <Button
        onClick={()=>{
          navigate("/profile/edit", {
          state: { background: location }
        });}}
        className='full-width'>
        Обновить личную информацию
      </Button>
      <div ref={ref}></div>
      <Text>
        Заявки
      </Text>
      {orders && <OrdersList orderByDate={orders}>
      </OrdersList>}

      <div className='navigation-container'>
        { (orders && (filter.pageNumber-1) * filter.pageSize > filter.pageSize-1) && 
            <SecondaryButton onClick={()=>dispatch(updateFilter({pageNumber: filter.pageNumber-1}))}>
              Назад
            </SecondaryButton>
        }
        { (orders && (filter.pageNumber) * filter.pageSize < orders?.total) && 
            <SecondaryButton onClick={()=>{dispatch(updateFilter({pageNumber: filter.pageNumber+1}));
            }}>
              Вперед
            </SecondaryButton>
        }
      </div>

    </Page>
)};
