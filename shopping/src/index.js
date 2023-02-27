const express = require("express");
const { PORT } = require("./config");
const { databaseConnection } = require("./database");
const expressApp = require("./express-app");
const dotENV = require("dotenv");
dotENV.config();

const StartServer = async () => {
  const app = express();

  await databaseConnection();

  await expressApp(app);

  app
    .listen(process.env.PORT, () => {
      console.log(`listening to port ${process.env.PORT}`);
    })
    .on("error", (err) => {
      console.log(err);
      process.exit();
    });
};

StartServer();