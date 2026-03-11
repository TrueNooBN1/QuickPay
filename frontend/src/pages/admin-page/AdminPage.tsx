import { useEffect, useLayoutEffect, useRef, useState, type FC } from 'react';
// import { useNavigate } from 'react-router-dom';
import { Page } from '../Page';
import { OrdersList} from '../../components/orderlist/OrderList';
import { useSelector } from 'react-redux';
import { getAllOrders, ordersFilterSelector, ordersSelector, patchOrder, resetOrdersFilterAdminState, updateFilter, type TPatchOrderStatus } from '../../services/slices/OrderSlice/OrderSlice';
import Input from '../../components/input/input';
import TextInput from '../../components/input/text-input';
import Text from '../../components/text/text';
import { useDispatch } from '../../services/store/store';
import Button from '../../components/button/button';
import SecondaryButton from '../../components/button/secondary-button/secondary-button';
import { TOrderStatus, type TAdminData } from '../../utils/types';
import { adminDataSelector, getAdminData, patchAdminData } from '../../services/slices/RateSlice/RateSlice';
import { OrderFilters } from '../../components/orderfilters/OrderFilters';

type TCheckType = {
  changed: boolean,
  prevValue: string
}

export const AdminPage: FC = () => {
//   const navigate = useNavigate();

  const ref = useRef<HTMLDivElement>(null);

  const dispatch = useDispatch();  
  const orders = useSelector(ordersSelector);
  const filter = useSelector(ordersFilterSelector);
  const adminData = useSelector(adminDataSelector);

  const [commissionUpdated, setCommissionUpdated] = useState<TCheckType>({changed: false, prevValue: ""});
  const [walletUpdated, setWalletUpdated] = useState<TCheckType>({changed: false, prevValue: ""});

  const onAccept = (id: string) => {
    // console.log(`accept ${id}`);
    const patchOrderData: TPatchOrderStatus = {
      id: id,
      status: TOrderStatus.ready
    } 
    dispatch(patchOrder(patchOrderData));
  }

  const onDecline = async (id: string) => {
    // console.log(`decline ${id}`);
    const patchOrderData: TPatchOrderStatus = {
      id: id,
      status: TOrderStatus.denied
    } 
    dispatch(patchOrder(patchOrderData));
  }

  const handleCommissionChange = (newValue: string) => {
    // dispatch(patchAdminData({ comission: parseFloat(newValue) }));
    setCommissionUpdated({prevValue: newValue, changed: adminData?.comission !== Number(newValue)})
  };
  const handleWalletChange = (newValue: string) => {
    // setWalletValue(newValue);
    setWalletUpdated({prevValue: newValue, changed: adminData?.comission !== Number(newValue)})
  };

  const updateWalletAdminData = ()=>{
    const adminData : TAdminData = {
      buyWallet: walletUpdated.prevValue
    }
    dispatch(patchAdminData(adminData))
  }

  const updateComissionAdminData = ()=>{
    const adminData : TAdminData = {
      comission: Number(commissionUpdated.prevValue)
    }
    // console.log("const updateComissionAdminData", commissionUpdated)
    dispatch(patchAdminData(adminData))
  }

  useLayoutEffect(() => {
    dispatch(resetOrdersFilterAdminState());
    dispatch(getAdminData())
  }, []);

  useEffect(() => {
    // console.log('adminData changed', adminData)
    if(adminData?.comission){
      // handleCommissionChange(adminData?.comission.toString())
      setCommissionUpdated({changed: false, prevValue: adminData?.comission.toString()})
    }
    if(adminData?.buyWallet){
      // handleWalletChange(adminData?.buyWallet)
      setWalletUpdated({changed: false, prevValue: adminData?.buyWallet})
    }
  },[adminData]);

  useEffect(() => {
    dispatch(getAllOrders(filter));
    if (ref.current) {
      ref.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest'
      });
    }
  }, [filter]);

  return (
  <Page>
    <Text>
      Установить комиссию(%)
    </Text>
    <Input
     onValueChange={handleCommissionChange}
     unit={"%"}
     value={commissionUpdated.prevValue}
     className='full-width'
     placeholder='Установите комиссию'/>
    {commissionUpdated.changed && <Button onClick={()=>{updateComissionAdminData()}}>
      Сохранить
    </Button>}


    <Text>
      Установить кошелек для покупки
    </Text>
    <TextInput
     onValueChange={handleWalletChange}
     unit={""}
     value={walletUpdated.prevValue}
     className='full-width'
     placeholder='Установите кошелек'/>
     {walletUpdated.changed &&
        <Button onClick={()=>{updateWalletAdminData()}}>
          Сохранить
        </Button>
      }
     

    <Text>
      Установить фильтр для заявок
    </Text>
     {/* <Button onClick={()=>{
      dispatch(getAllOrders(filter));
     }}>
      Применить
     </Button> */}
     <OrderFilters onApply={() => {
        // Дополнительные действия после применения фильтров
        // console.log('Filters applied');
      }} />

    <div ref={ref}></div>
    <Text>
      Заявки
    </Text>
    

    
    {orders && <OrdersList orderByDate={orders} onAccept={onAccept} onDecline={onDecline}>
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
