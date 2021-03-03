const { request, response } = require("express");
const { Product, Category, Image } = require("../db/models/index");
const {
  createImages,
  readCategory,
  readCategories,
} = require("../helpers/db-helpers");
const filesManage = require("../helpers/files-manage");

module.exports = {
  getAll: async (req = request, res = response) => {
    try {
      const { limit = 5, offset = 0 } = req.query;
      const products = await Product.findAndCountAll({
        offset,
        limit,
        include: [
          {
            model: Category,
            attributes: ["name"],
          },
          {
            model: Image,
            attributes: ["url"],
          },
        ],
      });
      res.json(products);
    } catch (error) {
      res.status(500).json({
        msg: "Something went wrong trying to access to database!",
        error,
      });
    }
  },

  getOne: async (req = request, res = response) => {
    try {
      const { id } = req.params;
      const product = await Product.findOne({
        where: {
          id,
        },
        include: [
          {
            model: Category,
            attributes: ["id", "name"],
          },
          {
            model: Image,
            attributes: ["url"],
          },
        ],
      });
      res.json(product);
    } catch (error) {
      res.status(500).json({
        msg: "Something went wrong trying to access to database!",
        error,
      });
    }
  },

  create: async (req = request, res = response) => {
    const { name: n, description: d, price, stock, categoryIds } = req.body;
    const name = n.toUpperCase();
    const description = d ? d : "No description";

    let ids = categoryIds
      .replace("[", "")
      .replace("]", "")
      .split(",")
      .map((a) => a * 1);

    let files = [...req.filesValidate];

    const resultsImages = await Promise.all(
      files.map((file) => filesManage.uploadFile(file))
    );
    const resultsCategories = await Promise.all(
      ids.map((id) => readCategory(id))
    );
    const urlImages = resultsImages.map((img) => ({
      url: img.secure_url,
    }));

    const product = await Product.create(
      {
        name,
        description,
        price,
        stock,
        Images: urlImages,
      },
      {
        include: {
          model: Image,
        },
      }
    );

    await product.setCategories(resultsCategories);
    const newProd = await Product.findOne({
      where: {
        id: product.id,
      },
      include: [
        {
          model: Category,
          attributes: ["id", "name"],
        },
        {
          model: Image,
          attributes: ["url"],
        },
      ],
    });

    console.log(urlImages);
    console.log(resultsCategories);
    res.json({
      newProd,
    });
    // .then((cloudUrls) => {
    //   // console.log(value);
    //   console.log(cloudUrls);

    //   const imageUrls = cloudUrls.map((url) => ({
    //     url: url.secure_url,
    //   }));
    //   return imageUrls;
    // })
    // .then(async (urls) => {
    //   const product = await Product.create(
    //     {
    //       name,
    //       description,
    //       price,
    //       stock,
    //       Images: urls,
    //     },
    //     {
    //       include: {
    //         model: Image,
    //       },
    //     }
    //   );
    //   res.json({
    //     respuesta: "ok",
    //     product,
    //   });
    // })
    // .catch((error) => {
    //   console.log(error);
    //   res.status(500).json({
    //     msg:
    //       "Something went wrong trying to access to database! - create product",
    //     error,
    //   });
    // });
  },

  update: async (req = request, res = response) => {
    // TODO: Validar que no exista el nombre en la base de datos, solo para create:

    // TODO: Validar extensiones permitidas:

    // TODO: Limpiar imágenes previas, solo para update, no create:
    res.json("productController.update");
  },

  remove: async (req = request, res = response) => {
    res.json("productController.remove");
  },

  categoryAdd: async (req = request, res = response) => {
    res.json("productController.categoryAdd");
  },

  categoryRemove: async (req = request, res = response) => {
    res.json("productController.categoryRemove");
  },
};
