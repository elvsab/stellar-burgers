import { FC, SyntheticEvent, useState } from 'react';
import { RegisterUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import {
  registerUser,
  selectUserError,
  selectUserLoading
} from '../../services/slices/userSlice';
import { ProtectedRoute } from '../../components/protected-route';

export const Register: FC = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const loading = useSelector(selectUserLoading);
  const errorText = useSelector(selectUserError);

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    try {
      await dispatch(
        registerUser({ name: userName, email, password })
      ).unwrap();
    } catch {}
  };

  return (
    <ProtectedRoute onlyUnAuth>
      <RegisterUI
        errorText={errorText || ''}
        email={email}
        userName={userName}
        password={password}
        setEmail={setEmail}
        setPassword={setPassword}
        setUserName={setUserName}
        handleSubmit={handleSubmit}
      />
    </ProtectedRoute>
  );
};
