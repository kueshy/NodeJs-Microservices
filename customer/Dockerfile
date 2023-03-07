FROM node

WORKDIR /app/customer

COPY package.json .

RUN npm install
# RUN npm uninstall bcrypt
# RUN npm i bcrypt

COPY . .

EXPOSE 8081

CMD [ "npm", "start" ]
