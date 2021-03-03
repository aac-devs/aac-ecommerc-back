const { Image, Product, Category } = require("../db/models/index");

const createImage = (urlImage) => {
  return new Promise((resolve, reject) => {
    const image = Image.create({
      url: urlImage,
    });
    resolve(image);
  });
};

const createImages = (arrayUrls) => {
  return new Promise((resolve, reject) => {
    const images = Promise.all(arrayUrls.map((url) => createImage(url)));
    resolve(images);
  });
};

const readCategory = (id) => {
  return new Promise(async (resolve, reject) => {
    const category = await Category.findByPk(id);
    resolve(category);
  });
};

const readCategories = (arrayIds) => {
  console.log(arrayIds);
  return new Promise((resolve, reject) => {
    const categories = Promise.all(arrayIds.map((id) => readCategory(id)));
    resolve(categories);
  }).catch((err) => {
    console.log("error en read");
  });
};

const createProduct = (product, images) => {
  return new Promise((resolve, reject) => {});
};

module.exports = {
  createImages,
  readCategory,
  readCategories,
};
