import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { RootState } from '../../services/store';
import { Preloader } from '@ui';

type Props = {
  children: JSX.Element;
  onlyUnAuth?: boolean;
};

export const ProtectedRoute = ({ children, onlyUnAuth = false }: Props) => {
  const { user, isAuth, isAuthChecked } = useSelector(
    (state: RootState) => state.user
  );
  const location = useLocation();

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (onlyUnAuth && isAuth) {
    const { from } = (location.state as any) || { from: { pathname: '/' } };
    return <Navigate to={from.pathname} replace />;
  }

  if (!onlyUnAuth && !isAuth) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return children;
};
