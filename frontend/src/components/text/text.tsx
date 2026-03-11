// components/Button/Button.tsx
import React from 'react';
import type { FC } from 'react';
import './text.css'; // общие стили для всех страниц

export interface TextProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
  className?: string;
}

const Text: FC<TextProps> = ({ 
  children, 
  className = ''
}) => {
  return (
    <p className={`text ${className}`}>
      {children}
    </p>
  );
};

export default Text;