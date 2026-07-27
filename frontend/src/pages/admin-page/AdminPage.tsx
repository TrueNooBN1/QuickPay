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
import { TOrderStatus, type TAdminData} from '../../utils/types';
import { adminDataSelector, getAdminData, patchAdminData } from '../../services/slices/RateSlice/RateSlice';
import { OrderFilters } from '../../components/orderfilters/OrderFilters';
import { downloadOrdersXLSX } from '../../utils/api';

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

  const [commissionSellUpdated, setSellCommissionUpdated] = useState<TCheckType>({changed: false, prevValue: ""});
  const [commissionBuyUpdated, setBuyCommissionUpdated] = useState<TCheckType>({changed: false, prevValue: ""});
  const [walletUpdated, setWalletUpdated] = useState<TCheckType>({changed: false, prevValue: ""});

  const onAccept = (id: string, executionRate: number) => {
    // console.log(`accept ${id}`);
    const patchOrderData: TPatchOrderStatus = {
      id: id,
      status: TOrderStatus.ready,
      executionRate
    } 
    dispatch(patchOrder(patchOrderData));
  }

  const onDecline = async (id: string) => {
    // console.log(`decline ${id}`);
    const patchOrderData: TPatchOrderStatus = {
      id: id,
      status: TOrderStatus.denied,
      executionRate: 0
    } 
    dispatch(patchOrder(patchOrderData));
  }

  const handleSellCommissionChange = (newValue: string) => {
    // dispatch(patchAdminData({ comission: parseFloat(newValue) }));
    setSellCommissionUpdated({prevValue: newValue, changed: adminData?.comissionSell !== Number(newValue)})
  };
  
  const handleBuyCommissionChange = (newValue: string) => {
    // dispatch(patchAdminData({ comission: parseFloat(newValue) }));
    setBuyCommissionUpdated({prevValue: newValue, changed: adminData?.comissionBuy !== Number(newValue)})
  };
  
  const handleWalletChange = (newValue: string) => {
    // setWalletValue(newValue);
    setWalletUpdated({prevValue: newValue, changed: (adminData?.comissionBuy !== Number(newValue) || adminData?.comissionSell !== Number(newValue))})
  };

  const updateWalletAdminData = ()=>{
    const adminData : TAdminData = {
      buyWallet: walletUpdated.prevValue
    }
    dispatch(patchAdminData(adminData))
  }

  const updateComissionBuyAdminData = ()=>{
    const adminData : TAdminData = {
      comissionBuy: Number(commissionBuyUpdated.prevValue)
    }
    // console.log("const updateComissionAdminData", commissionUpdated)
    dispatch(patchAdminData(adminData))
  }

  const updateComissionSellAdminData = ()=>{
    const adminData : TAdminData = {
      comissionSell: Number(commissionSellUpdated.prevValue),
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
    if(adminData?.comissionBuy){
      // handleCommissionChange(adminData?.comission.toString())
      setBuyCommissionUpdated({changed: false, prevValue: adminData?.comissionBuy.toString()})
    }
    if(adminData?.comissionSell){
      // handleCommissionChange(adminData?.comission.toString())
      setSellCommissionUpdated({changed: false, prevValue: adminData?.comissionSell.toString()})
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
      Установить комиссию (покупка)(%)
    </Text>
    <Input
     onValueChange={handleBuyCommissionChange}
     unit={"%"}
     value={commissionBuyUpdated.prevValue}
     className='full-width'
     placeholder='Установите комиссию'/>
    {commissionBuyUpdated.changed && <Button onClick={()=>{updateComissionBuyAdminData()}}>
      Сохранить
    </Button>}
    <Text>
      Установить комиссию (продажа)(%)
    </Text>
    <Input
     onValueChange={handleSellCommissionChange}
     unit={"%"}
     value={commissionSellUpdated.prevValue}
     className='full-width'
     placeholder='Установите комиссию'/>
    {commissionSellUpdated.changed && <Button onClick={()=>{updateComissionSellAdminData()}}>
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

    <Button className='full-width' onClick={async ()=>{
      return await downloadOrdersXLSX(filter)
    }}>
      Скачать XLSX по фильтру
    </Button>

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
        <SecondaryButton onClick={()=>{dispatch(updateFilter({pageNumber: filter.pageNumber+1}))}}>
          Вперед
        </SecondaryButton>
      }
    </div>

  </Page>
)};
