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
import { getUserData } from '../../services/slices/UserSlice/UserSlice';
import { Modal } from '../modal/Modal';
import OrderForm from '../../forms/OrderForm/OrderForm';
import { ProfilePage } from '../../pages/profile-page/ProfilePage';
import { AdminPage } from '../../pages/admin-page/AdminPage';

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const backgroundLocation = location.state && location.state.background;
  const closeModal = () => {
    navigate(backgroundLocation || '/');
  };
  const dispatch = useDispatch();

  useEffect(() => {
    // dispatch(updateMarketData());
    dispatch(getUserData());
  }, [dispatch]);

  return (
    <div className="app">
      <AppHeader />
      <Routes location={backgroundLocation || location}>
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
        {backgroundLocation && (
          <Routes>
            {/* <Route
              path='/orders/:number'
              element={
                <ProtectedRoute onlyUnAuth={false}>
                  <Modal title='Заказ' onClose={closeModal}>
                    <OrderInfo />
                  </Modal>
                </ProtectedRoute>
              }
            /> */}
            <Route
              path='/exchange/create'
              element={
                <Modal title='Заказ' onClose={closeModal}>
                  <OrderForm />
                </Modal>
              }
            />
          </Routes>
        )}
      {/* <AppFooter /> */}
    </div>
  )
}

export default App
