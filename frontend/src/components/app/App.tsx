import { useEffect } from 'react'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch } from '../../services/store/store'
import './App.css';
import { MainPage } from '../../pages/main-page';
import { NotFound404 } from '../../pages/not-found-404';
import { AboutPage } from '../../pages/about-page';
import AppHeader from '../appheader/appheader';
import { ExchangePage } from '../../pages/exchange-page/ExchangePage';
import { Modal } from '../../forms/modal/modal';
import { ProfilePage } from '../../pages/profile-page/ProfilePage';
import { AdminPage } from '../../pages/admin-page/AdminPage';
import { getRates, rateSelector } from '../../services/slices/RateSlice/RateSlice';
import OrderUserDataForm from '../../forms/OrderForm/OrderUserDataForm';
import UpdateUserDataForm from '../../forms/OrderForm/UpdateUserDataForm';
import "./../../assets/fonts/Montserrat-SemiBold.woff";
import AppFooter from '../appfooter/appfooter';
import { useSelector } from 'react-redux';
import Preloader from '../preloader/preloader';

function App() {

  const location = useLocation();
	const navigate = useNavigate();

	const locationState = location.state as { background?: Location; };
	const background = locationState && locationState.background;

  const closeModal = () => {
    navigate(background || '/');
  };
  const dispatch = useDispatch();

  const rates = useSelector(rateSelector);
  // const user = useSelector(userDataSelector);
  const loading = !rates?.rateIn || !rates?.rateOut;

  // useEffect(() => {
  //   dispatch(loginUser());
  // }, [user]);


  useEffect(() => {
    // Если данные уже есть - ничего не делаем
    // if (rates?.rateIn && rates.rateOut) return;

    // Функция для запроса
    const fetchDataIfNeeded = () => {
      dispatch(getRates());
    };

    // // Сразу выполняем первый запрос
    // fetchDataIfNeeded();

    // // Устанавливаем интервал
    // console.log(rates?.rateIn === 0 || rates?.rateOut === 0, rates?.rateIn,  rates?.rateOut)
    const intervalId = setInterval(fetchDataIfNeeded, !rates || rates?.rateIn === 0 || rates?.rateOut === 0 ? 3000: 10000)
    // Очищаем интервал при размонтировании или когда данные появятся
    return () => clearInterval(intervalId);
  }, [dispatch, rates]); // rates в зависимостях - интервал пересоздастся при изменении rates

  

  if(loading){
    return (
    <div className="app">
      <AppHeader />
      <Preloader />
      <AppFooter />
    </div>
    )
  }

  return (
    <div className="app">
      <AppHeader />
      <Routes location={background || location}>
        <Route path='/' element={<MainPage/> } />
        <Route path='/about' element={<AboutPage />} />
        <Route path='/exchange' element={<ExchangePage />} />
        <Route path='/profile' element={<ProfilePage />} />
        <Route path='/admin' element={<AdminPage />} />
          {/* <Route path='/feed'>
            <Route index element={<Feed />} />
            <Route path=':number' element={<OrderInfo />} />
          </Route>
          <Route path='/profile'>
            <Route
              index
              element={
                <ProtectedRoute onlyUnAuth={false}>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route path='orders'>
              <Route
                index
                element={
                  <ProtectedRoute onlyUnAuth={false}>
                    <ProfileOrders />
                  </ProtectedRoute>
                }
              />
              <Route
                path=':number'
                element={
                  <ProtectedRoute onlyUnAuth={false}>
                    <OrderInfo />
                  </ProtectedRoute>
                }
              />
            </Route>
          </Route> */}
          <Route path='*' element={<NotFound404 />} />
        </Routes>

        {/* modalRoutes */}
        {background && (
          <Routes>
            <Route
              path='/exchange/create'
              element={
                <Modal title='Укажите информацию' onClose={closeModal}>
                  <OrderUserDataForm/>
                </Modal>
              }
            />
            <Route
              path='/profile/edit'
              element={
                <Modal title='Информация' onClose={closeModal}>
                  <UpdateUserDataForm/>
                </Modal>
              }
            />
          </Routes>
        )}
      <AppFooter />
    </div>
  )
}

export default App
