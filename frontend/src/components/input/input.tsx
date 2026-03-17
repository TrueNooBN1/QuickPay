import type { ChangeEvent } from 'react';
import "./input.css"


interface InputProps {
  onValueChange: (value: string) => void; // Колбэк для передачи значения наверх
  unit?:string;
  value?:string;
  className?:string;
  placeholder?: string;
}

const Input = ({ onValueChange, unit = "", value = "", className, placeholder}: InputProps) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onValueChange(newValue);
  };

  return (
    <div className={`input-unit-container ${className}`}>
      <input
        type="number"
        value={value}
        onChange={handleChange}
        placeholder={placeholder ? placeholder : `Введите сумму обмена`}
        className='input'
        pattern="\\d*"
      />
      <span className="input-unit__label">{`${unit}`}</span>
    </div>
    
  );
};

export default Input;