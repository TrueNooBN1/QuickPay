// import React from 'react';
import { useForm } from 'react-hook-form';
import type {SubmitHandler} from "react-hook-form";
import "./OrderForm.css";
import { apiUrl } from '../../const/const';
import type { TOrder } from '../../utils/types';
import '../../components/button/button.css';
import '../../components/text/text.css';
import '../../components/input/input.css';

interface TOrderFormInputs {
  fullName: string;
  wallet: string;
  phone: string;
}

// export type TOrder = {
//   _id: string;
//   userId: string;
//   name: string;
//   amount: string;
//   type: OrderType;
//   createdAt: string;
// };

const OrderForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
    reset,
    setError,
  } = useForm<TOrderFormInputs>({
    defaultValues: {
      fullName: '',
      wallet: '',
      phone: '',
    },
  });

  const onSubmit: SubmitHandler<TOrderFormInputs> = async (data) => {
    try {
      const response = await fetch(`${apiUrl}/order`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            // Authorization: `Bearer ${token}`
        },  
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const result = await response.json();
        if (result.errors) {
          Object.entries(result.errors).forEach(([field, message]) => {
            setError(field as keyof TOrderFormInputs, { type: 'server', message: message as string });
          });
        }
        throw new Error('Server error');
      }

      reset(); // очищаем форму после успеха
    } catch (error) {
      console.error(error);
      setError('root', {
          type: 'server',
          message: error as string || 'Ошибка сервера',
      });
        return;
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form">
      <div className="form-group">
        <label htmlFor="fullName" className='text'>ФИО</label>
        <input
          id="fullName"
          {...register('fullName', {
            required: 'ФИО обязательно',
            minLength: { value: 3, message: 'Минимум 3 символа' },
          })}
          className={`input_form ${errors.fullName ? 'error' : ''}`}
          placeholder="Иванов Иван Иванович"
        />
        {errors.fullName && <span className="error-message">{errors.fullName.message}</span>}
      </div>

      <div className="form-group">
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

      <div className="form-group">
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

      <button type="submit" disabled={isSubmitting} className='button'>
        {isSubmitting ? 'Отправка...' : 'Отправить'}
      </button>

      {isSubmitSuccessful && !isSubmitting && (
        <p className="success">Заявка отправлена!</p>
      )}
    </form>
  );
};

export default OrderForm;