import React from 'react';
import "../../components/button/button.css"
import Button from '../../components/button/button';

export type TUserInfoDataFormInputs = {
  name: string,
  wallet: string,
  phone:string
}



interface FormSubmitButtonProps {
  isSubmitting: boolean;
  isSubmitSuccessful: boolean;
  submitText?: string;
  children?: React.ReactNode;
}

const FormSubmitButton: React.FC<FormSubmitButtonProps> = ({ 
  isSubmitting, 
  isSubmitSuccessful,
  submitText = 'Заявка отправлена',
  children = 'Отправить' 
}) => {
  return (
    <>
      <button 
        type="submit" 
        disabled={isSubmitting} 
        className='button full-width'
      >
        {isSubmitting ? 'Отправка...' : children}
      </button>

      {isSubmitSuccessful && !isSubmitting && (
        <p className="success">{submitText}</p>
      )}
    </>
  );
};

export default FormSubmitButton;