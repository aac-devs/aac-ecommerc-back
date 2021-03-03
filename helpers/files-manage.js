const cloudinary = require("cloudinary").v2;
cloudinary.config(process.env.CLOUDINARY_URL);
const { Product, Category, Image } = require("../db/models/index");

module.exports = {
  uploadFile: (file) => {
    return new Promise((resolve, reject) => {
      const url = cloudinary.uploader.upload(file.tempFilePath);
      resolve(url);
      reject("");
    });
  },
};

// TODO: Limpiar imágenes previas, solo para update, no create:
