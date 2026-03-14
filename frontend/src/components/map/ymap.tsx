// YandexMapCustom.tsx
import React, { useEffect, useRef } from 'react';
import "./ymaps.css"

declare global {
  interface Window {
    ymaps: any;
  }
}

export interface YandexMapCustomProps {
  center: [number, number];
  zoom: number;
  apikey: string;
  markers?: Array<{
    coordinates: [number, number];
    hint?: string;
    balloon?: string;
  }>;
  className?: string;
}

export const YandexMapCustom: React.FC<YandexMapCustomProps> = ({
  center,
  zoom,
  apikey,
  markers = [],
  className,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const scriptLoadedRef = useRef(false);
  const initializedRef = useRef(false);

  useEffect(() => {
    // Предотвращаем двойную инициализацию
    if (initializedRef.current) return;
    
    // Функция инициализации карты
    const initMap = () => {
      if (!mapRef.current || mapInstanceRef.current || initializedRef.current) return;

      window.ymaps.ready(() => {
        if (!mapRef.current || initializedRef.current) return;
        
        // Создаем карту
        mapInstanceRef.current = new window.ymaps.Map(mapRef.current, {
          center: center,
          zoom: zoom,
          controls: ['zoomControl', 'fullscreenControl'],
        });

        // Добавляем метки
        markers.forEach((marker) => {
          const placemark = new window.ymaps.Placemark(
            marker.coordinates,
            {
              hintContent: marker.hint,
              balloonContent: marker.balloon,
            },
            {
              preset: 'islands#icon',
              iconColor: '#0095b6',
            }
          );
          mapInstanceRef.current.geoObjects.add(placemark);
        });
        
        initializedRef.current = true;
      });
    };

    // Загружаем API если еще не загружен
    if (!window.ymaps && !scriptLoadedRef.current) {
      scriptLoadedRef.current = true;
      const script = document.createElement('script');
      script.src = `https://api-maps.yandex.ru/2.1/?apikey=${apikey}&lang=ru_RU`;
      script.async = true;
      script.onload = initMap;
      script.onerror = () => {
        console.error('Failed to load Yandex Maps API');
        scriptLoadedRef.current = false;
      };
      document.body.appendChild(script);
    } else if (window.ymaps) {
      initMap();
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.destroy();
        mapInstanceRef.current = null;
        initializedRef.current = false;
      }
    };
  }, [center, zoom, apikey, markers]); // Зависимости остаются

  return <div ref={mapRef} className={`map-container ${className}`} />;
};