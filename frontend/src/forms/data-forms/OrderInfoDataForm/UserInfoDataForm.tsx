import React from 'react';
import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import "./UserInfoDataForm.css"

export interface TUserInfoDataFormInputs {
  fullName: string;
  wallet: string;
  phone: string;
}

interface TUserInfoDataFormFieldsProps {
  register: UseFormRegister<TUserInfoDataFormInputs>;
  errors: FieldErrors<TUserInfoDataFormInputs>;
}

const UserInfoDataFormFields: React.FC<TUserInfoDataFormFieldsProps> = ({ register, errors }) => {


  return (
    <div className='order-info-form'>
      <div className="order-info-form-group">
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
  );
};

export default UserInfoDataFormFields;