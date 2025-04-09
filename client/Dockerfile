# client/Dockerfile
FROM node:20-alpine

# Установка зависимостей для вотчера файлов в Docker
RUN apk add --no-cache curl

WORKDIR /app

# 1. Копируем зависимости
COPY package.json package-lock.json* ./
RUN npm install --force

# 2. Копируем конфигурации
COPY vite.config.ts ./
COPY tsconfig.json ./

# 3. Копируем исходный код
COPY src ./src
COPY public ./public

# 4. Настраиваем переменные окружения для Vite
ENV VITE_API_URL=http://localhost:8080/api/v1
ENV VITE_WS_URL=ws://localhost:8080

# 5. Открываем порты
EXPOSE 5173

# 6. Запускаем dev-сервер с настройками для Docker
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]