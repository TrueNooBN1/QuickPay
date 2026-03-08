import { useEffect } from 'react'
import './App.css'
import { Route, Routes, useLocation, useNavigate, type To } from 'react-router-dom'
import { useDispatch } from '../../services/store/store'
// import styles from './App.css';
// import * as styles from './App.css';
import './App.css';
import { MainPage } from '../../pages/main-page';
import { NotFound404 } from '../../pages/not-found-404';
import { AboutPage } from '../../pages/about-page';
import AppHeader from '../appheader/appheader';
import { ExchangePage } from '../../pages/exchange-page/ExchangePage';
import { getUserData, loginUser, userDataSelector } from '../../services/slices/UserSlice/UserSlice';
import { Modal } from '../modal/Modal';
import { ProfilePage } from '../../pages/profile-page/ProfilePage';
import { AdminPage } from '../../pages/admin-page/AdminPage';
import { getRates, rateStatusSelector } from '../../services/slices/RateSlice/RateSlice';
import type { TTelegramLoginData } from '../../utils/api';
import { useSelector } from 'react-redux';

function App() {

  const location = useLocation();
	const navigate = useNavigate();
	// const { getProducts } = useActionCreators(productsActions);
	// const { authCheck, checkUserAuth } = useActionCreators(userActions);
	const handleModalClose = (path: To | number) => () => navigate(path as To);

  const loginData :TTelegramLoginData =  {
    telegramId: "1"
  }

	// useEffect(() => {
	// 	getRates();
	// 	loginUser(loginData);
	// }, [getRates]);

	const locationState = location.state as { background?: Location; };
	const background = locationState && locationState.background;

  // const navigate = useNavigate();
  // const location = useLocation();

  // const backgroundLocation = location.state && location.state.background;
  const closeModal = () => {
    navigate(background || '/');
  };
  const dispatch = useDispatch();

  // useEffect(() => {
  //   // dispatch(updateMarketData());
  //   dispatch(getUserData());
  // }, [dispatch]);

    const authData :TTelegramLoginData = {telegramId: "dsadsadsadsa"} ;

    useEffect(() => {
      dispatch(loginUser(authData));
      dispatch(getRates());
    }, [dispatch]);

    // const userData = useSelector(userDataSelector);
    // console.log("const userData " + JSON.stringify(userData))
  

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
                  {/* <OrderForm /> */}
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
