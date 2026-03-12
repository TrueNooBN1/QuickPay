FROM node:20-alpine
# создание директории приложения
WORKDIR /app/frontend

#установка зависимостей
# астериск ("*") по возможности скопирует оба файла: package.json и package-lock.json
# тот же символ делает копирование опциональным, т. е. без файла сборка не упадёт
COPY package.json ./
RUN npm install 
# копируем исходный код
COPY . . 

CMD [ "npm", "run", "build"] 

# FROM alpine:latest

# WORKDIR /app/frontend

# # Просто копируем уже собранные файлы
# COPY dist/ /build-output/


