FROM node:latest

WORKDIR /app

COPY . .

RUN yarn install

EXPOSE $PORT

ENTRYPOINT ["yarn", "start"]
