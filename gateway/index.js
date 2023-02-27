const express = require("express");
const cors = require("cors");
const proxy = require("express-http-proxy");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/customers", proxy("http://localhost:8081"));
app.use("/shopping", proxy("http://localhost:8083"));
app.use("/", proxy("http://localhost:8082"));

app.listen(8080, () => {
  console.log("Gateway listening on port 8080");
});
