import { useEffect} from 'react';
import type {FC} from "react"
import { useSelector, useDispatch } from '../../services/store/store';
import { Link, useNavigate } from 'react-router-dom';
import './MainPage.css';
import { Page} from '../Page/Page';
import Button from '../../components/button/button';
import RatePresenter from '../../components/rate-presenter/rate-presenter';
import { supportLink } from '../../const/const';
import { getRates, rateSelector, rateStatusSelector } from '../../services/slices/RateSlice/RateSlice';
// import { ReqStatus } from '../../utils/types';
import Preloader from '../../components/preloader/preloader';
import OrderCard from '../../components/ordercard/OrderCard';
import type { TOrder } from '../../utils/types';

export const MainPage: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate()

  useEffect(() => {
    dispatch(getRates());
  }, [dispatch]);


  const rates = useSelector(rateSelector);
  const loading = useSelector(rateStatusSelector);

  // const [rateIn, setRateIn] = useState(80);//to globalStore
  // const [rateOut, setRateOut] = useState(82);//toGlobalStore

  if (!rates) {
    return <Preloader/>
  }

  return (
    <Page>
       <div className={`container`}>
        <RatePresenter 
          header='Продажа'
          rate={rates.rateIn}
          rateStringConverterFunc={(value: number)=>`Курс продажи:\n${value} руб.\nза 1 USDT`}
          className={loading ? "blur" : ""}
        />

        <RatePresenter
          header='Покупка'
          rate={rates.rateOut}
          rateStringConverterFunc={(value: number)=>`Курс покупки:\n${value} руб.\nза 1 USDT`}
          className={loading ? "blur" : ""}
        />
      </div>

      <Button onClick={()=>{
        navigate("/exchange")
      }}>
          Обмен
      </Button>

      <Button onClick={()=>{
        navigate("/profile")
      }}>
        Профиль
      </Button>

      <Button onClick={()=>{
        navigate("/about")
      }}>
        О нас
      </Button>

      <Button>
        <Link target='_blank' to={supportLink} className='link'>
          Поддержка
        </Link>
      </Button>

      <Button onClick={()=>{
        navigate("/admin")
      }}>
        Админка
      </Button>
      
    </Page>
  );
};
