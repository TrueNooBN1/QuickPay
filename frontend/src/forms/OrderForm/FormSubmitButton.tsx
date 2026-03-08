import React from 'react';

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
        className='button'
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