// components/Button/Button.tsx
import React from 'react';
import type { FC } from 'react';
import './secondary-button.css'; // общие стили для всех страниц

export interface ButtonProps {
  children?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

const SecondaryButton: FC<ButtonProps> = ({ 
  children, 
  onClick, 
  className = '' 
}) => {
  return (
    <button className={`secondary-button ${className}`} onClick={onClick}>
      {children}
    </button>
  );
};

export default SecondaryButton;