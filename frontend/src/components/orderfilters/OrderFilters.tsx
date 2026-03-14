import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TOrderStatus } from '../../utils/types';
import { ordersFilterSelector, updateFilter } from '../../services/slices/OrderSlice/OrderSlice';
import './OrderFilters.css';
import SecondaryButton from '../button/secondary-button/secondary-button';

interface OrderFiltersProps {
  onApply?: () => void;
}

export const OrderFilters: React.FC<OrderFiltersProps> = ({ onApply }) => {
  const dispatch = useDispatch();
  const currentFilter = useSelector(ordersFilterSelector);

  // Локальное состояние для фильтров
  const [selectedStatuses, setSelectedStatuses] = useState<TOrderStatus[]>(
    currentFilter?.status || []
  );
  const [searchName, setSearchName] = useState('');
  const [searchPhone, setSearchPhone] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // Статусы для отображения
  const statusOptions = [
    { value: TOrderStatus.created, label: 'Создан', color: '#3498db' },
    { value: TOrderStatus.ready, label: 'Готов', color: '#2ecc71' },
    { value: TOrderStatus.denied, label: 'Отклонён', color: '#e74c3c' },
  ];

  // Обработчики
  const handleStatusChange = (status: TOrderStatus) => {
    setSelectedStatuses(prev => {
      if (prev.includes(status)) {
        return prev.filter(s => s !== status);
      } else {
        return [...prev, status];
      }
    });
  };

  const handleSearchName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchName(e.target.value);
  };
  const handleSearchPhone = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchPhone(e.target.value);
  };

  const handleDateFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateFrom(e.target.value);
  };

  const handleDateToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateTo(e.target.value);
  };

  const handleApply = () => {
    // Преобразуем даты в ISO строки для API
    const fromDate = dateFrom ? new Date(dateFrom).toISOString() : undefined;
    const toDate = dateTo ? new Date(dateTo).toISOString() : undefined;

    dispatch(updateFilter({
      status: selectedStatuses.length > 0 ? selectedStatuses : undefined,
      phone: searchPhone || undefined,
      name: searchName || undefined,
      createDateFrom: fromDate,
      createDateTo: toDate,
      pageNumber: 1, // Сбрасываем на первую страницу при применении фильтров
    }));

    onApply?.();
  };

  const handleReset = () => {
    setSelectedStatuses([]);
    setSearchPhone('');
    setSearchName('');
    setDateFrom('');
    setDateTo('');

    dispatch(updateFilter({
      status: undefined,
      search: undefined,
      createDateFrom: undefined,
      createDateTo: undefined,
      pageNumber: 1,
    }));

    onApply?.();
  };

  // Загружаем сохранённые фильтры при монтировании
  useEffect(() => {
    if (currentFilter) {
      setSelectedStatuses(currentFilter.status || []);
      // При необходимости преобразовать обратно из ISO
      // if (currentFilter.createDateFrom) {
      //   setDateFrom(currentFilter.createDateFrom.split('T')[0]);
      // }
      // if (currentFilter.createDateTo) {
      //   setDateTo(currentFilter.createDateTo.split('T')[0]);
      // }
    }
  }, [currentFilter]);

  return (
    <div className="order-filters">
      <h3 className="filters-title">Фильтры</h3>

      {/* Блок статусов */}
      <div className="filter-section">
        <label className="filter-label">Статус заявки</label>
        <div className="status-checkboxes">
          {statusOptions.map(status => (
            <label key={status.value} className="status-checkbox">
              <input
                type="checkbox"
                checked={selectedStatuses.includes(status.value)}
                onChange={() => handleStatusChange(status.value)}
              />
              <span 
                className="status-indicator"
                style={{ backgroundColor: status.color }}
              />
              <span className="status-label">{status.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Поиск по имени/телефону */}
      <div className="filter-section">
        <label className="filter-label">Поиск по имени</label>
        <input
          type="text"
          className="filter-input"
          placeholder="Имя"
          value={searchName}
          onChange={handleSearchName}
        />
      </div>

      <div className="filter-section">
        <label className="filter-label">Поиск по телефону</label>
        <input
          type="text"
          className="filter-input"
          placeholder="Телефон"
          value={searchPhone}
          onChange={handleSearchPhone}
        />
      </div>

      {/* Диапазон дат */}
      <div className="filter-section">
        <label className="filter-label">Дата создания</label>
        <div className="date-range">
          <div className="date-input-group">
            <span className="date-label">От</span>
            <input
              type="date"
              className="filter-input"
              value={dateFrom}
              onChange={handleDateFromChange}
              max={dateTo} // Нельзя выбрать дату позже "до"
            />
          </div>
          <div className="date-input-group">
            <span className="date-label">До</span>
            <input
              type="date"
              className="filter-input"
              value={dateTo}
              onChange={handleDateToChange}
              min={dateFrom} // Нельзя выбрать дату раньше "от"
            />
          </div>
        </div>
      </div>

      {/* Кнопки действий */}
      <div className="filter-actions">
        <SecondaryButton onClick={handleApply}  className = "order-filter__button">
          Применить фильтры
        </SecondaryButton>
        <SecondaryButton onClick={handleReset} className = "order-filter__button">
          Сбросить
        </SecondaryButton>
      </div>
    </div>
  );
};