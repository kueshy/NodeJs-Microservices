FROM node

WORKDIR /app/shopping

COPY package.json .

RUN npm install
# RUN npm uninstall bcrypt
# RUN npm i bcrypt

COPY . .

EXPOSE 8083

CMD [ "npm", "start" ]