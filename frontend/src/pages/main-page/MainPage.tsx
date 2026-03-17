import type {FC} from "react"
import { useSelector } from '../../services/store/store';
import { useNavigate } from 'react-router-dom';
import './MainPage.css';
import { Page} from '../Page/Page';
import Button from '../../components/button/button';
import RatePresenter from '../../components/rate-presenter/rate-presenter';
import { rateSelector } from '../../services/slices/RateSlice/RateSlice';
// import { ReqStatus } from '../../utils/types';
import Preloader from '../../components/preloader/preloader';
import { TOrderType } from '../../utils/types';
import { userDataSelector, UserRole } from '../../services/slices/UserSlice/UserSlice';

export const MainPage: FC = () => {
  // const dispatch = useDispatch();
  const navigate = useNavigate()


  const userData = useSelector(userDataSelector);
  const rates = useSelector(rateSelector);
  const loading = !rates?.rateIn || !rates?.rateOut;

  if (!rates || rates.rateIn === 0 || rates.rateOut === 0) {
    return <Preloader/>
  }
  
  return (
    <Page>
       <div className={`container`}>
        <RatePresenter
          type={TOrderType.Buy}
          rate={rates.rateIn}
          className={`half-width ${loading ? "blur" : ""}`}
        />

        <RatePresenter 
          type={TOrderType.Sell}
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
