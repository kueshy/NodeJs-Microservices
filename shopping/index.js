const express = require("express");

const app = express();

app.use(express.json());

app.use("/", (req, res) => {
  return res.status(200).json({ msg: "Hello from shopping" });
});

app.listen(8083, () => {
  console.log("Shipping listening on port 8083");
});
