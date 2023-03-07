const express = require("express");
// const { PORT } = require("./config");
const { databaseConnection } = require("./database");
const expressApp = require("./express-app");
const dotenv = require("dotenv");
const { CreateChannel } = require("./utils");
dotenv.config();

const StartServer = async () => {
  const app = express();

  await databaseConnection();

  const channel = await CreateChannel();

  await expressApp(app, channel);

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
