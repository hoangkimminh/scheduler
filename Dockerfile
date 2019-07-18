FROM node:latest

WORKDIR /app

COPY . .

ENV PORT=3001

RUN yarn install

EXPOSE $PORT

ENTRYPOINT ["yarn", "start"]
