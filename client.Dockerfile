FROM node:20

ENV TZ=Asia/Seoul
RUN mkdir -p /app
WORKDIR /app
COPY . .
RUN corepack enable && pnpm install
RUN pnpm api build

RUN pnpm --filter client build

CMD ["pnpm", "--filter", "client", "start"]
