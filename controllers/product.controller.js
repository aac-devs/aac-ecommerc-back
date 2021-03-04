const { request, response } = require("express");
const { Product, Category, Image } = require("../db/models/index");
const {
  // createImages,
  // readCategory,
  addCategoriesToProduct,
  getProductById,
  // readCategories,
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
          { model: Category, attributes: ["name"] },
          { model: Image, attributes: ["url"] },
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
      const product = await getProductById(id);
      res.json(product);
    } catch (error) {
      res.status(500).json({
        msg: "Something went wrong trying to access to database!",
        error,
      });
    }
  },

  create: async (req = request, res = response) => {
    try {
      const { name: n, description: d, price, stock, categoryIds } = req.body;
      const name = n.toUpperCase();
      const description = d ? d : "No description";

      // Se leen las imágenes que ya pasaron la validación de la extensión.
      let files = [...req.filesValidate];
      // console.log(files);
      // Se envían todas las imágenes a Cloudinary.
      const resultsImages = await Promise.all(
        files.map((file) => filesManage.uploadFile(file))
      );
      // Se leen las urls devueltas desde Cloudinary para agregarlas en la tabla Image y relacionarla con Product.
      const urlImages = resultsImages.map((img) => ({
        url: img.secure_url,
      }));
      // Se crea el producto con las urls de la imágenes guardadas.
      const product = await Product.create(
        { name, description, price, stock, Images: urlImages },
        { include: { model: Image } }
      );
      // Se relaciona el producto con las categorías que llegan en el body
      const msg = await addCategoriesToProduct(product, categoryIds);
      // Se lee el producto creado en la base de datos, de modo que incluya las imágenes y categoría relacionadas.
      const newProd = await getProductById(id);
      res.json({
        message: msg,
        "product info": newProd,
      });
    } catch (error) {
      res.status(500).json({
        msg: "Something went wrong trying to access to database!",
        error,
      });
    }
  },

  update: async (req = request, res = response) => {
    try {
      const { id } = req.params;
      const { name: n, description: d, price, stock, categoryIds } = req.body;
      const name = n.toUpperCase();
      const description = d ? d : "No description";
      // Borra las imágenes de Cloudinary y de la tabla Image
      await filesManage.deleteImages(id);
      const product = await Product.findByPk(id);
      // Elimina la relación del producto con las categorías
      await product.setCategories([]);
      // Se leen las imágenes que ya pasaron la validación de la extensión.
      let files = [...req.filesValidate];
      // Se envían todas las imágenes a Cloudinary.
      const resultsImages = await Promise.all(
        files.map((file) => filesManage.uploadFile(file))
      );
      // Se leen las urls devueltas desde Cloudinary para agregarlas en la tabla Image y relacionarla con Product.
      const newImages = await Promise.all(
        resultsImages.map(
          async (img) =>
            await Image.create({
              url: img.secure_url,
            })
        )
      );
      // Se crea el producto con las urls de la imágenes guardadas.
      const productUpdated = await product.update({
        name,
        description,
        price,
        stock,
      });
      await productUpdated.addImages(newImages);
      // Se relaciona el producto con las categorías que llegan en el body
      const msg = await addCategoriesToProduct(productUpdated, categoryIds);
      // Se lee el producto creado en la base de datos, de modo que incluya las imágenes y categoría relacionadas.
      const newProd = await getProductById(id);
      res.json({
        message: msg,
        "product info": newProd,
      });
    } catch (error) {
      res.status(500).json({
        msg: "Something went wrong trying to access to database!",
        error,
      });
    }
  },

  remove: async (req = request, res = response) => {
    try {
      const { id } = req.params;
      await filesManage.deleteImages(id);
      await Product.destroy({
        where: {
          id,
        },
      });
      res.json({
        msg: "Product deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        msg: "Something went wrong trying to access to database!",
        error,
      });
    }
  },

  categoryAdd: async (req = request, res = response) => {
    try {
      const { idProduct, idCategory } = req.params;
      const product = await Product.findOne({
        where: {
          id: idProduct,
        },
      });
      const category = await Category.findOne({
        where: {
          id: idCategory,
        },
      });
      const resp = await product.addCategory(category);

      if (!resp) {
        res.json({
          msg: "The relationship you are trying to create already exists",
        });
      } else {
        res.json({ rel: resp[0] });
      }
    } catch (error) {
      res.status(500).json({
        msg: "Something went wrong trying to access to database!",
        error,
      });
    }
  },

  categoryRemove: async (req = request, res = response) => {
    try {
      const { idProduct, idCategory } = req.params;
      const product = await Product.findOne({
        where: {
          id: idProduct,
        },
        include: [
          {
            model: Category,
            attributes: ["id", "name"],
          },
        ],
      });
      const categories = product.Categories.filter(
        (cat) => cat.id.toString() !== idCategory
      );
      const resp = await product.setCategories(categories);
      if (resp.length > 0) {
        res.json({
          msg: "Relationship removed succesfully",
        });
      } else {
        res.json({
          msg: `The relationship you are trying to remove doesn't exists`,
        });
      }
    } catch (error) {
      res.status(500).json({
        msg: "Something went wrong trying to access to database!",
        error,
      });
    }
  },
};
