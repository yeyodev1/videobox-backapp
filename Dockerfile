FROM node:18

RUN apt-get update && apt-get install -y ffmpeg

WORKDIR /src

COPY package*.json ./

RUN npm install

COPY . .

RUN mkdir tmp

RUN npm run compile

RUN npm run 

EXPOSE 8080

CMD [ "node", "dist/index.js" ]