import { useEffect } from 'react'
import './App.css'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch } from '../../services/store/store'
// import styles from './App.css';
// import * as styles from './App.css';
import './App.css';
import { MainPage } from '../../pages/main-page';
import { NotFound404 } from '../../pages/not-found-404';
import { AboutPage } from '../../pages/about-page';
import AppHeader from '../appheader/appheader';
import { ExchangePage } from '../../pages/exchange-page/ExchangePage';
import { loginUser } from '../../services/slices/UserSlice/UserSlice';
import { Modal } from '../../forms/modal/modal';
import { ProfilePage } from '../../pages/profile-page/ProfilePage';
import { AdminPage } from '../../pages/admin-page/AdminPage';
import { getRates } from '../../services/slices/RateSlice/RateSlice';
import type { TTelegramLoginData } from '../../utils/api';
import OrderUserDataForm from '../../forms/OrderForm/OrderUserDataForm';
import UpdateUserDataForm from '../../forms/OrderForm/UpdateUserDataForm';
import "./../../assets/fonts/Montserrat-SemiBold.woff";
import AppFooter from '../appfooter/appfooter';

function App() {

  const location = useLocation();
	const navigate = useNavigate();

	const locationState = location.state as { background?: Location; };
	const background = locationState && locationState.background;

  const closeModal = () => {
    navigate(background || '/');
  };
  const dispatch = useDispatch();

  const authData :TTelegramLoginData = {telegramId: "213123321"} ;

  useEffect(() => {
    dispatch(loginUser(authData));
    dispatch(getRates());
  }, [dispatch]);


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
