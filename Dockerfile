# Використовуємо офіційний образ Node.js
FROM node:lts

# Встановлюємо глобально nodemon
RUN npm install -g nodemon

# Встановлюємо робочу директорію всередині контейнера
WORKDIR .

# Копіюємо package.json та package-lock.json
COPY package*.json ./

# Встановлюємо залежності проекту
RUN npm install

# Копіюємо весь проект у робочу директорію
COPY . .

# Вказуємо, що додаток слухає на порт 3000
EXPOSE 3000

# Команда для запуску додатка
CMD ["nodemon", "app.mjs"]
