// components/Page.jsx
import React from 'react';
import type { FC } from 'react';
import './Page.css'; // общие стили для всех страниц

/**
 * Компонент-обертка для страниц с общими стилями
 * @param {Object} props
 * @param {React.ReactNode} props.children - содержимое страницы
 * @param {string} props.className - дополнительные CSS классы
 * @param {string} props.id - ID страницы (для стилизации конкретной страницы)
 */

export interface PageProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export const Page: FC<PageProps> = ({ 
  children, 
  className = '', 
  id = '' 
}) => {
  return (
    <div className={`page ${className}`} id={id}>
      {children}
    </div>
  );
};

