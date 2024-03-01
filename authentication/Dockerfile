FROM node:14
WORKDIR /videoapp
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["node", "auth.js"]