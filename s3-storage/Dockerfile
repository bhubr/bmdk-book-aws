FROM node:14-alpine
WORKDIR /app
COPY package*.json .
RUN npm install --only=production
COPY src ./src
COPY videos ./videos
CMD npm start