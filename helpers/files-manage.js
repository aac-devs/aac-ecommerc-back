const cloudinary = require("cloudinary").v2;
cloudinary.config(process.env.CLOUDINARY_URL);
const { Image } = require("../db/models/index");

module.exports = {
  uploadFile: (file) => {
    return new Promise((resolve, reject) => {
      try {
        const url = cloudinary.uploader.upload(file.tempFilePath);
        resolve(url);
      } catch (error) {
        reject(error);
      }
    });
  },
  deleteImages: async (id) => {
    const images = await Image.findAll({
      where: {
        product_id: id,
      },
    });
    if (images.length > 0) {
      const urlImages = images.map((img) => img.url);
      urlImages.forEach(async (url) => {
        const nameArray = url.split("/");
        const [public_id] = nameArray[nameArray.length - 1].split(".");
        await cloudinary.uploader.destroy(public_id);
      });
      const resp = await Image.destroy({
        where: {
          product_id: id,
        },
      });
      return resp;
    }
    return 0;
  },
};
