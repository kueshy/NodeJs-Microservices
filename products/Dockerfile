FROM node

WORKDIR /app/products

COPY package.json .

RUN npm install
# RUN npm uninstall bcrypt
# RUN npm i bcrypt

COPY . .

EXPOSE 8082

CMD [ "npm", "start" ]