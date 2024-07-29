FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .

ENV NODE_OPTIONS="--max-old-space-size=4096"

ENV PORT=3000

RUN npm run build

EXPOSE 3000

CMD [ "npm","run","start" ]