import { useState, type ReactNode } from 'react';
import type { Location } from 'react-router-dom';

import { Navigate, useLocation } from 'react-router-dom';
import Preloader from '../preloader/preloader';
import { useDispatch, useSelector } from 'react-redux';
import { getUserData, userAuthCheckedSelector, userAuthenticatedSelector } from '../../services/slices/UserSlice/UserSlice';
import type { TUser } from '../../utils/types';

type TProtectedRouteProps = {
	children: ReactNode;
	onlyUnAuth?: boolean;
};

type BackgroundState = {
	background?: Location;
};


type FromState = {
	from?: Location & BackgroundState;
	background?: Location;
};

export default function ProtectedRoute({ children, onlyUnAuth }: TProtectedRouteProps) {
	const dispatch = useDispatch();
	const [userData, setUserData] = useState<TUser>();
  const isAuthenticated = useSelector(userAuthenticatedSelector);
	const user = useSelector(getUserData);
	const isAuthChecked = useSelector(userAuthCheckedSelector);
	const location: Location<FromState> = useLocation() as Location<FromState>;

	if (!isAuthChecked) {
		// console.log('WAIT USER CHECKOUT');
		return <Preloader />;
	}

	// Редирект на целевой компонент
	if (onlyUnAuth && userData) {
		// console.log('NAVIGATE FROM LOGIN TO INDEX/FROM');
		const from = location.state?.from || { pathname: '/' };
		const background = location.state?.from?.background || null;
		return <Navigate replace to={from} state={{background}}/>;
	}

	// Редирект на страницу логина при отсутствии пользователя в сторе
	if (!onlyUnAuth && !userData) {
		// console.log('NAVIGATE FROM PAGE TO LOGIN', location);		
		return <Navigate replace to={'/login'} state={{ from: {...location, background: location.state?.background}}} />;
	}

	return children; // все хорошо и рендерим компонент
}
