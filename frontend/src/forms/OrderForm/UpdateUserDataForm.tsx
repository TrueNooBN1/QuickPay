import React, { useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import FormSubmitButton, { type TUserInfoDataFormInputs } from './FormSubmitButton';
import "./UserDataForm.css"
import { useSelector } from 'react-redux';
import { updateUser, userDataSelector } from '../../services/slices/UserSlice/UserSlice';
import { useDispatch } from '../../services/store/store';
import Preloader from '../../components/preloader/preloader';
import { useNavigate } from 'react-router-dom';
import type { TUser } from '../../utils/types';

interface UpdateUserDataFormProps {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

const UpdateUserDataForm: React.FC<UpdateUserDataFormProps> = ({ 
  onSuccess, 
  onError,
}) => {
  const userData = useSelector(userDataSelector);
  const navigate = useNavigate();
  // console.log(`const OrderForm: userData: ${JSON.stringify(userData)}`)
  const dispatch = useDispatch();
  const submitText='Заявка отправлена';
  const btnText='Редактировать';

  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
    reset,
    setError,
  } = useForm<TUserInfoDataFormInputs>({
    defaultValues: {
    name: userData?.name || '',
    wallet: userData?.wallet || '',
    phone: userData?.phone || '',
  },
  });

  // console.log('User data:', userData);


  const onSubmit: SubmitHandler<TUserInfoDataFormInputs> = async (data) => {
    try {
      // console.log('Form data:', data);
      if(!userData)
        return;
      
      // Обновляем данные пользователя
      const updatedUserData : TUser = {
        name: data.name,
        wallet: data.wallet,
        phone: data.phone,
        id: userData.id,
        roles: userData.roles
      };
      
      // console.log("Updated user data:", updatedUserData);
      if(userData && JSON.stringify(updatedUserData) !== JSON.stringify(userData)){
        dispatch(updateUser(updatedUserData))
      }

      // reset();
      onSuccess?.();
      navigate(-1);
    } catch (error) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : 'Ошибка сервера';
      setError('root', { type: 'server', message: errorMessage });
      onError?.(error as Error);
    }
  };


  useEffect(() => {
    // if(!userData)
    //   dispatch(getUserData());
    
    if (userData) {
      reset({
        name: userData.name || '',
        wallet: userData.wallet || '',
        phone: userData.phone || '',
      });
    }
  }, [userData, reset]);

  if (!userData) {
    return <Preloader/>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form">
        <div className='or der-info-form'>
          <div className="order-info-form-group">
            <label htmlFor="name" className='text'>ФИО</label>
            <input
              id="name"
              {...register('name', {
                required: 'ФИО обязательно',
                minLength: { value: 3, message: 'Минимум 3 символа' },
              })}
              className={`input_form ${errors.name ? 'error' : ''}`}
              placeholder="Иванов Иван Иванович"
            />
            {errors.name && <span className="error-message">{errors.name.message}</span>}
          </div>

          <div className="order-info-form-group">
            <label htmlFor="wallet" className='text'>Кошелек USDT (TRC20)</label>
            <input
              id="wallet"
              {...register('wallet', {
                required: 'Кошелек обязателен',
                pattern: {
                  value: /^T[a-zA-Z0-9]{33}$/,
                  message: 'Неверный формат (должен начинаться с T, 34 символа)',
                },
              })}
              className={`input_form ${errors.wallet ? 'error' : ''}`}
              placeholder="Txxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
            />
            {errors.wallet && <span className="error-message">{errors.wallet.message}</span>}
          </div>

          <div className="order-info-form-group">
            <label htmlFor="phone" className='text'>Телефон</label>
            <input
              id="phone"
              {...register('phone', {
                required: 'Телефон обязателен',
                pattern: {
                  value: /^(\+7|8)?[\s\-]?\(?\d{3}\)?[\s\-]?\d{3}[\s\-]?\d{2}[\s\-]?\d{2}$/,
                  message: 'Введите корректный номер',
                },
              })}
              className={`input_form ${errors.phone ? 'error' : ''}`}
              placeholder="+7-999-999-99-99"
            />
            {errors.phone && <span className="error-message">{errors.phone.message}</span>}
          </div>
        </div>
      <FormSubmitButton 
        isSubmitting={isSubmitting} 
        isSubmitSuccessful={isSubmitSuccessful}
        submitText={submitText}
      >
        {btnText}
      </FormSubmitButton>
    </form>
  );
};

export default UpdateUserDataForm;