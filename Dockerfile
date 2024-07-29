FROM node:20-alpine

WORKDIR /app

COPY package*.json .

RUN npm install --force

COPY . .

ENV NODE_OPTIONS="--max-old-space-size=4096"

EXPOSE 3000

CMD [ "npm","run","start" ]