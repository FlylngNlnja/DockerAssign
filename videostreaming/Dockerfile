FROM node:14
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY index.js ./
COPY index.html ./
EXPOSE 3000
CMD ["node", "index.js"]