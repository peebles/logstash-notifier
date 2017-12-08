FROM node:4-slim
ENV NPM_CONFIG_LOGLEVEL warn
RUN npm install -g forever
RUN apt-get update && apt-get install -y less
ADD . /deploy/app
WORKDIR /deploy/app
RUN ls
RUN npm install
EXPOSE 3000
WORKDIR /data
CMD forever --spinSleepTime 5000 --fifo /deploy/app/app.js
