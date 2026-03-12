import type { FC } from 'react';
import './appfooter.css';

export interface AppHeaderProps {
  className?: string;
}

const AppFooter: FC<AppHeaderProps> = ({ className = '' }) => {
  return (
    <footer className={`app-footer ${className}`}>
    </footer>
  );

};

export default AppFooter;