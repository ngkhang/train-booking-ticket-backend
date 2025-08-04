FROM node:latest

WORKDIR /app

COPY package*.json ./

RUN npm install

# Copy all files in this project to working directory of Docker container
COPY . .

RUN npm run build

# The port of Docker
EXPOSE  3000

VOLUME /app

CMD ["node", "./dist/main.js"]
