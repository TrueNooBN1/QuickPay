import { type FC } from 'react';
// import { useNavigate } from 'react-router-dom';
import { Page } from '../Page';
import { TOrderType, type TOrder } from '../../utils/types';
import { OrdersList} from '../../components/orderlist/OrderList';
// import { useSelector } from 'react-redux';
// import { userDataSelector } from '../../services/slices/UserSlice/UserSlice';
import { apiUrl } from '../../const/const';
import UpdateUserDataForm from '../../forms/OrderForm/UpdateUserDataForm';

export const ProfilePage: FC = () => {
// //   const navigate = useNavigate();
//   const dispatch = useDispatch();
//     useEffect(() => {
//       dispatch(getUserData());
//     }, [dispatch]);

  // const userData = useSelector(userDataSelector);

  
  const orders: TOrder[] = [{
    _id: "1",
    exchangeRate: 100,
    exchangeValue: 100,
    totalSum: 100,
    createdAt: new Date().toISOString(),
    name: "userName",
    status: 'created',
    type: TOrderType.Buy,
    phone: "983213821",
    userId: "2",
    wallet: "walletString"
  },{
    _id: "2",
    exchangeRate: 1000,
    exchangeValue: 1000,
    totalSum: 1000,
    createdAt: new Date().toISOString(),
    name: "userName",
    status: 'created',
    type: TOrderType.Sell,
    phone: "983213821",
    userId: "2",
    wallet: "walletString"
  },
  ];

  return (
  <Page>
    <UpdateUserDataForm
    apiUrl={apiUrl}/>
    <h2>
        Заявки
    </h2>
    <OrdersList orderByDate={orders}>
    </OrdersList>
  </Page>
)};
