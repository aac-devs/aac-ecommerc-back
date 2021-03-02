const { request, response } = require("express");
const { Product, Category } = require("../db/models/index");

const cloudinary = require("cloudinary").v2;
cloudinary.config(process.env.CLOUDINARY_URL);

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
            attributes: ["id", "name"],
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
    const productFind = await Product.findOne({
      where: {
        name,
      },
    });
    if (productFind) {
      return res.status(400).json({
        msg: `Product '${productFind.name}' already exist in database!`,
      });
    }

    return res.json({
      msg: "hasta aquí",
      name,
      description,
      price,
      stock,
      categoryIds,
    });

    let files = [];
    const aux = req.files?.files || req.files || [];
    aux instanceof Array ? (files = aux) : files.push(aux);

    // TODO: Validar extensiones permitidas:

    // TODO: Limpiar imágenes previas, solo para update, no create:

    const prom = (file) => {
      return new Promise((resolve, reject) => {
        const url = cloudinary.uploader.upload(file.tempFilePath);
        resolve(url);
        reject("");
      });
    };

    Promise.all(files.map((file) => prom(file)))
      .then((resp) => {
        const urls = resp.map((r) => r.secure_url);
        console.log(urls);
        res.json({
          respuesta: "ok",
          urls,
        });
      })
      .catch((err) => {
        res.json("no ok");
      });

    // try {

    // const secure_urls = files.map((file) => {
    //   console.log(file);
    // });

    // const name = req.body.name.toUpperCase();
    // const description = req.body.description
    //   ? req.body.description
    //   : "No description";
    // const categoryFind = await Category.findOne({
    //   where: {
    //     name,
    //   },
    // });
    // if (categoryFind) {
    //   return res.status(400).json({
    //     msg: `Category ${categoryFind.name} already exist in database!`,
    //   });
    // }
    // const categorySaved = await Category.create({
    //   name,
    //   description,
    // });
    //   res.json("ok");
    // } catch (error) {
    //   res.status(500).json({
    //     msg: "Something went wrong trying to access to database!",
    //     error,
    //   });
    // }
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
