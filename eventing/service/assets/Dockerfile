# syntax=docker/dockerfile:1
FROM node:18.14.2-alpine

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install --production
RUN npm install fastify

COPY . .

CMD ["node", "server"]