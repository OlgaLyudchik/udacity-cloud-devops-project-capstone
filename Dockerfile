FROM node:15-alpine
LABEL maintainer="Olga Lyudchik helga.lyudchik@gmail.com"

WORKDIR /usr/src/weather-app

COPY weather-app/ .

RUN npm install

EXPOSE 3000

CMD [ "npm", "start" ] 