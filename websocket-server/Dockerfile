FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/
COPY websocketServer.js ./
COPY .env ./

RUN npm install

RUN npx prisma generate

EXPOSE 8080

CMD ["node", "websocketServer.js"]