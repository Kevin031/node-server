FROM node:18-alpine as build-stage
WORKDIR /app
COPY package*.json /app
RUN npm install
RUN npm run build
COPY ./dist /app

EXPOSE 3000
CMD ["pm2-runtime", "start", "./dist/index.js"]
