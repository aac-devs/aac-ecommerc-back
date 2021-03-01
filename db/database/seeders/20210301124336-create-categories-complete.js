"use strict";
const faker = require("faker");
const { Category } = require("../../models/index");
const { Product } = require("../../models/index");
const { Image } = require("../../models/index");
/*
  COMANDOS CLI DE SEQUELIZE:
npx sequelize-cli seed:generate --name create-users  (crea un archivo seed)
npx sequelize-cli db:seed:all (genera las siembras)
npx sequelize-cli db:seed:undo:all  (deshace todas las siembras)
ó
drop table sequelize_data; (en el shell)
*/

// Función que crea las imágenes que se relacionarán con los productos
const createImages = async (imagesXproduct) => {
  try {
    // Array que guardará los registros creados en la tabla Image, que será devuelto
    let arrayImages = [];
    // Se crean la cantidad de imágenes que indica el parámetro 'imagesXproduct'
    for (let i = 0; i < imagesXproduct; i++) {
      arrayImages.push(
        // Crea la imagen y se carga en el array
        await Image.create({
          url: faker.image.imageUrl(),
        })
      );
    }
    // Retorna el arreglo de imágenes creadas
    return arrayImages;
  } catch (error) {
    console.log("Error en Imagenes");
    console.log(error);
  }
};

// Función que creará los productos y los relacionará con las imágenes
const createProducts = async (totalProducts, imagesXproduct) => {
  try {
    // Arreglo que guardará la imágenes creadas
    let arrayImages = [];
    // Arreglo que guardará los productos que se crearán para luego retornarlos
    let arrayProducts = [];
    // Variable temporal de producto creado
    let product;

    // Se crean la cantidad de productos que indica el parámetro 'totalProducts'
    for (let i = 0; i < totalProducts; i++) {
      // Las imágenes creadas es guardan para luego hacer la relación, se le pasan la cantidad de imágenes que se quieren crear por producto 'imagesXproduct'
      arrayImages = await createImages(imagesXproduct);
      // Se crea el producto
      product = await Product.create({
        name: faker.commerce.productName().toUpperCase(),
        description: faker.commerce.productDescription(),
        price: faker.commerce.price(),
        stock: faker.finance.account(),
      });
      // Se realiza la relación: Al producto creado se le agregan las imágenes creadas
      await product.addImages(arrayImages);
      // Se carga el producto en el array
      arrayProducts.push(product);
    }
    // Se retorna el array de productos creados
    return arrayProducts;
  } catch (error) {
    console.log("Error en Productos");
    console.log(error);
  }
};

// Función que creará la categoría y se relacionará con productos.
const createCategories = async (totalProducts = 1, imagesXproduct = 1) => {
  try {
    // Se crean la cantidad de productos indicados en 'totalProducts'
    const products = await createProducts(totalProducts, imagesXproduct);
    // Se crea la categoría
    const category = await Category.create({
      name: faker.commerce.productAdjective().toUpperCase(),
      description: faker.commerce.productDescription(),
    });
    // Se realiza la relación: A la categoría creada se le agregan los productos creados
    category.addProducts(products);
    // Se retorna la categoría
    return category;
  } catch (error) {
    console.log("Error en Categorías");
    console.log(error);
  }
};

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      // Crea una categoría que contiene 2 productos y 3 imágenes por producto:
      createCategories(2, 3),
      // Crea una categoría que contiene 3 productos y 1 imagen por producto:
      createCategories(3, 1),
      // Crea una categoría que contiene 1 producto y 2 imágenes por producto:
      createCategories(1, 2),
      // Crea una categoría que contiene 1 producto y 2 imágenes por producto:
      createCategories(4, 2),
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Categories", null, {});
  },
};
