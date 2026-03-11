import { useEffect, useState, type FC } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './AppHeader.css';

export interface AppHeaderProps {
  className?: string;
}

const AppHeader: FC<AppHeaderProps> = ({ className = '' }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Проверяем, находимся ли мы на главной странице
  const isHomePage = location.pathname === '/';
  
  // Обработчик клика по кнопке "На главную"
  const handleHomeClick = () => {
    navigate('/');
  };


  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Меняем цвет после прокрутки на 50px
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener('scroll', handleScroll);
    
    // Вызываем сразу для установки начального состояния
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`app-header ${isScrolled ? 'app-header__scrolled' : ''} ${className}`}>
      <div className="app-header__container">
        <Link 
          to={"/"} 
          className= {isHomePage ? "app-header__logo-text-disabled": ""}
          onClick={e => {e.preventDefault(); handleHomeClick()}}
        >
          <div className="app-header__logo">
            <span className="app-header__logo-text"></span>
          </div>
        </Link>
      </div>
    </header>
  );

};

export default AppHeader;