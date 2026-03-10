import { useEffect} from 'react';
import type {FC} from "react"
import { useSelector, useDispatch } from '../../services/store/store';
import { useNavigate } from 'react-router-dom';
import './MainPage.css';
import { Page} from '../Page/Page';
import Button from '../../components/button/button';
import RatePresenter from '../../components/rate-presenter/rate-presenter';
import { getRates, rateSelector } from '../../services/slices/RateSlice/RateSlice';
// import { ReqStatus } from '../../utils/types';
import Preloader from '../../components/preloader/preloader';
import { TOrderType, type TOrder } from '../../utils/types';
import { userDataSelector, UserRole } from '../../services/slices/UserSlice/UserSlice';

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
          type={TOrderType.Sell}
          rate={rates.rateIn}
          className={`half-width ${loading ? "blur" : ""}`}
        />

        <RatePresenter
          type={TOrderType.Buy}
          rate={rates.rateOut}
          className={`half-width ${loading ? "blur" : ""}`}
        />
      </div>

      <Button 
        onClick={()=>{
          navigate("/exchange")
        }}
        className='full-width'
      >
          Обмен
      </Button>

      <Button
        onClick={()=>{
          navigate("/profile")
        }}
        className='full-width'
      >
        Профиль
      </Button>

      <Button
        onClick={()=>{
          navigate("/about")
        }}
        className='full-width'
      >
        О нас
      </Button>

      {/* <Button>
        <Link target='_blank' to={supportLink} className='link'>
          Поддержка
        </Link>
      </Button> */}

      {userData?.roles && userData.roles.find((item)=>item === UserRole.ADMIN) && <Button 
      onClick={()=>{
        navigate("/admin")
      }}
      className='full-width'>
        Админка
      </Button>
      }   
      
    </Page>
  );
};
