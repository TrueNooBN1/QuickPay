import React, { useEffect, useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import FormSubmitButton, { type TUserInfoDataFormInputs } from './FormSubmitButton';
import "./UserDataForm.css"
import Text from '../../components/text/text';
import { useSelector } from 'react-redux';
import { useDispatch } from '../../services/store/store';
import { TOrderType, type TNewOrder } from '../../utils/types';
import Preloader from '../../components/preloader/preloader';
import { orderSelector, submitOrder } from '../../services/slices/OrderSlice/OrderSlice';
import { useNavigate } from 'react-router-dom';

interface OrderUserDataFormProps {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

const OrderUserDataForm: React.FC<OrderUserDataFormProps> = ({ 
  onSuccess, 
  onError,
}) => {
  const orderData = useSelector(orderSelector);
  const navigate = useNavigate();
  const [isInitialized, setIsInitialized] = useState(false);
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
    reset,
    setError,
  } = useForm<TUserInfoDataFormInputs>({
    defaultValues: {
      name: orderData?.name || '', // используем userData, а не orderData
      wallet: orderData?.wallet || '',
      phone: orderData?.phone || '',
    },
  });

  const onSubmit: SubmitHandler<TUserInfoDataFormInputs> = async (data) => {
    try {
      // console.log('Form data:', data);
      if (!orderData) return;

      const newOrderData: TNewOrder = {
        name: data.name,
        wallet: orderData.type === TOrderType.Sell ? data.wallet : "placeholder",
        phone: data.phone,
        userId: orderData.userId, // используем userData.id
        exchangeRate: orderData.exchangeRate,
        exchangeValue: orderData.exchangeValue,
        totalSum: orderData.totalSum,
        type: orderData.type
      };
      
      // console.log("New order data:", newOrderData);
      
      // Ждём результат и проверяем успех
      const resultAction = await dispatch(submitOrder(newOrderData));
      
      if (submitOrder.fulfilled.match(resultAction)) {
        // console.log('Order submitted successfully');
        onSuccess?.();
        navigate("/profile");
      } else {
        throw new Error('Failed to submit order');
      }

    } catch (error) {
      console.error('Submit error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Ошибка сервера';
      setError('root', { type: 'server', message: errorMessage });
      onError?.(error as Error);
    }
  };

  useEffect(() => {
    if (orderData && !isInitialized) {
      reset({
        name: orderData.name || '',
        wallet: orderData.wallet || '',
        phone: orderData.phone || '',
      });
      setIsInitialized(true);
    }
  }, [orderData, reset, isInitialized]);

  if (!orderData || !orderData) {
    return <Preloader />;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form">
        <div className='order-info-form'>
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

          {orderData.type === TOrderType.Sell && <div className="order-info-form-group">
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
          </div>}

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
        submitText="Заявка отправлена"
      >
        <Text>Отправить заявку</Text>
      </FormSubmitButton>
    </form>
  );
};
export default OrderUserDataForm;