const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const amqplib = require("amqplib");

const { APP_SECRET } = require("../config");
const dotEnv = require("dotenv");
dotEnv.config();

//Utility functions
module.exports.GenerateSalt = async () => {
  return await bcrypt.genSalt();
};

module.exports.GeneratePassword = async (password, salt) => {
  return await bcrypt.hash(password, salt);
};

module.exports.ValidatePassword = async (
  enteredPassword,
  savedPassword,
  salt
) => {
  return (await this.GeneratePassword(enteredPassword, salt)) === savedPassword;
};

module.exports.GenerateSignature = async (payload) => {
  try {
    return await jwt.sign(payload, process.env.APP_SECRET, {
      expiresIn: "30d",
    });
  } catch (error) {
    console.log(error);
    return error;
  }
};

module.exports.ValidateSignature = async (req) => {
  try {
    const signature = req.get("Authorization");
    console.log(signature);
    const payload = await jwt.verify(
      signature.split(" ")[1],
      process.env.APP_SECRET
    );
    req.user = payload;
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

module.exports.FormateData = (data) => {
  if (data) {
    return { data };
  } else {
    // throw new Error("Data Not found!");
    console.log("Data Not Found");
  }
};

// ====================== Message broker =====================

// Create channel
module.exports.CreateChannel = async () => {
  try {
    const connection = await amqplib.connect(process.env.MESSAGE_QUEUE_URL);
    const channel = await connection.createChannel();
    await channel.assertExchange(process.env.EXCHANGE_NAME, "direct", false);
    return channel;
  } catch (error) {
    throw error;
  }
};

// Subscribe messages
module.exports.SubscribeMessage = async (channel, service) => {
  const appQueue = await channel.assertQueue(process.env.QUEUE_NAME);

  channel.bindQueue(
    appQueue.queue,
    process.env.EXCHANGE_NAME,
    process.env.CUSTOMER_BINDING_KEY
  );

  channel.consume(appQueue.queue, (data) => {
    console.log("Received data");
    console.log(data.content.toString());
    service.SubscribeEvents(data.content.toString());
    console.log(data);
  });
};
