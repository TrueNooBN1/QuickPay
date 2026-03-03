import { useState, type ChangeEvent } from 'react';
import "./input.css"


interface InputProps {
  onValueChange: (value: string) => void; // Колбэк для передачи значения наверх
  unit?:string;
  value?: string;
}

const Input = ({ onValueChange, unit = "", value = ""}: InputProps) => {
  // const [value, setValue] = useState('');
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    // setValue(e.target.value);
    onValueChange(newValue);
  };

  return (
    <div className="input-unit-container">
      <input
        type="number"
        value={value}
        onChange={handleChange}
        placeholder="Введите значение..."
        className='input'
      />
      <span className="input-unit__label">{unit}</span>
    </div>
    
  );
};

export default Input;