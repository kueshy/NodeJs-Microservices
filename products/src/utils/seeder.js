const ProductModel = require("../database/models/Product");
const products = require("../sampledata.json");

const dbConnection = require("../database/connection");

dbConnection();

const seedProducts = async () => {
  await ProductModel.deleteMany();

  await ProductModel.insertMany(products);
  process.exit(1);
};

seedProducts();
