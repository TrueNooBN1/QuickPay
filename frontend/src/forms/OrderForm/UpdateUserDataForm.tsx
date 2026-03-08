import React, { useEffect, useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import UserInfoDataFormFields, { type TUserInfoDataFormInputs } from '../data-forms/OrderInfoDataForm/UserInfoDataForm';
import OrderFormSubmitButton from './FormSubmitButton';
import "./UserDataForm.css"
import Text from '../../components/text/text';
import { useSelector } from 'react-redux';
import { updateUser, userDataSelector } from '../../services/slices/UserSlice/UserSlice';
import { useDispatch } from '../../services/store/store';
import type { TUpdateUserData, TUser } from '../../utils/types';
import Preloader from '../../components/preloader/preloader';

interface UpdateUserDataFormProps {
  apiUrl: string;
  token?: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

const UpdateUserDataForm: React.FC<UpdateUserDataFormProps> = ({ 
  apiUrl, 
  token, 
  onSuccess, 
  onError,
}) => {
  const userData = useSelector(userDataSelector);
  const [isInitialized, setIsInitialized] = useState(false);
  console.log(`const OrderForm: userData: ${JSON.stringify(userData)}`)
  const dispatch = useDispatch();
  const submitText='Заявка отправлена';
  const btnText='Отправить заявку';

  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
    reset,
    setError,
  } = useForm<TUserInfoDataFormInputs>({
    defaultValues: {
    fullName: userData?.name || '',
    wallet: userData?.wallet || '',
    phone: userData?.phone || '',
  },
  });



  const onSubmit: SubmitHandler<TUserInfoDataFormInputs> = async (data) => {
    try {
      console.log('Form data:', data);
      if(!userData)
      return;
      
      // Обновляем данные пользователя
      const updatedUserData : TUser = {
        name: data.fullName,
        wallet: data.wallet,
        phone: data.phone,
        id: userData.id,
        roles: userData.roles
      };
      
      console.log("Updated user data:", updatedUserData);
      if(userData){
        dispatch(updateUser(updatedUserData))
      }

      // reset();
      onSuccess?.();
    } catch (error) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : 'Ошибка сервера';
      setError('root', { type: 'server', message: errorMessage });
      onError?.(error as Error);
    }
  };


  useEffect(() => {
    if (userData && !isInitialized) {
      reset({
        fullName: userData.name || '',
        wallet: userData.wallet || '',
        phone: userData.phone || '',
      });
      setIsInitialized(true);
    }
  }, [userData, reset, isInitialized]);

  if (!userData) {
    return <Preloader/>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form">
      <UserInfoDataFormFields register={register} errors={errors} />
      <OrderFormSubmitButton 
        isSubmitting={isSubmitting} 
        isSubmitSuccessful={isSubmitSuccessful}
        submitText={submitText}
      >
        <Text>
          {btnText}
        </Text>
      </OrderFormSubmitButton>
    </form>
  );
};

export default UpdateUserDataForm;