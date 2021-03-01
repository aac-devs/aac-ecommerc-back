"use strict";

/*
npx sequelize-cli model:generate --name User --attributes name:string,age:integer
*/

const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    static associate(models) {
      // define association here
      Product.hasMany(models.Image, { as: "images", foreignKey: "product_id" });
      Product.belongsToMany(models.Category, { through: "product_category" });
    }
  }
  Product.init(
    {
      name: DataTypes.STRING,
      description: DataTypes.TEXT,
      price: DataTypes.REAL,
      stock: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Product",
    }
  );
  return Product;
};
