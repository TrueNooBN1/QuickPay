// components/Button/Button.tsx
import React from 'react';
import type { FC } from 'react';
import './tab-button.css'; // общие стили для всех страниц

export interface ButtonProps {
  children?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

const TabButton: FC<ButtonProps> = ({ 
  children, 
  onClick, 
  className = '' 
}) => {
  return (
    <button className={`tab-button ${className}`} onClick={onClick}>
      {children}
    </button>
  );
};

export default TabButton;