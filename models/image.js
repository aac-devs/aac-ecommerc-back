const { Model, DataTypes } = require("sequelize");
const sequelize = require("../database/config");

class Image extends Model {}

Image.init(
  {
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "image",
    timestamps: false,
  }
);

module.exports = Image;
