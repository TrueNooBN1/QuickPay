# Dockerfile
FROM nginx:latest

# Копируем конфигурацию
COPY ./nginx.conf /etc/nginx/nginx.conf

# Открываем порт
EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]