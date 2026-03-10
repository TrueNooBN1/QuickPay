import type { FC } from 'react';
import './AppFooter.css';

export interface AppHeaderProps {
  className?: string;
}

const AppFooter: FC<AppHeaderProps> = ({ className = '' }) => {
  return (
    <footer className='app-footer'>
    </footer>
  );

};

export default AppFooter;