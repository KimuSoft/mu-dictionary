FROM node:16

ENV TZ=Asia/Seoul

RUN mkdir -p /app

WORKDIR /app

COPY . .

WORKDIR /client

RUN yarn && yarn build

WORKDIR . ./server

RUN yarn && yarn build

CMD yarn prod
