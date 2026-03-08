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
import { loginUser, userDataSelector, UserRole } from '../../services/slices/UserSlice/UserSlice';

export const MainPage: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate()


  const rates = useSelector(rateSelector);
  const loading = !rates?.rateIn || !rates?.rateOut;


  const userData = useSelector(userDataSelector);

  useEffect(() => {
    // Если данные уже есть - ничего не делаем
    if (rates?.rateIn && rates.rateOut) return;

    // Функция для запроса
    const fetchDataIfNeeded = () => {
      dispatch(getRates());
    };

    // // Сразу выполняем первый запрос
    // fetchDataIfNeeded();

    // // Устанавливаем интервал
    const intervalId = setInterval(fetchDataIfNeeded, 5000);

    // Очищаем интервал при размонтировании или когда данные появятся
    return () => clearInterval(intervalId);
  }, [dispatch, rates]); // rates в зависимостях - интервал пересоздастся при изменении rates

  console.log("const userData " + JSON.stringify(userData))
  console.log("const rates " + JSON.stringify(rates))


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

      {/* <Button>
        <Link target='_blank' to={supportLink} className='link'>
          Поддержка
        </Link>
      </Button> */}

      {userData?.roles && userData.roles.find((item)=>item === UserRole.ADMIN) && <Button onClick={()=>{
        navigate("/admin")
      }}>
        Админка
      </Button>
      }   
      
    </Page>
  );
};
