// components/Button/Button.tsx
import React from 'react';
import type { FC } from 'react';
import './button.css'; // общие стили для всех страниц

export interface ButtonProps {
  children?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

const Button: FC<ButtonProps> = ({ 
  children, 
  onClick, 
  className = '' 
}) => {
  return (
    <button className={`button ${className}`} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;