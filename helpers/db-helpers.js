const { Image, Product, Category } = require("../db/models/index");

const readCategory = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const category = await Category.findByPk(id);
      resolve(category);
    } catch (error) {
      reject(error);
    }
  });
};

const addCategoriesToProduct = async (product, categoryIds) => {
  // Variable que contendrá el estado de la relación de la(s) categoría(s)
  let msg = "Categories added succesfully";
  // Si no llega nada en categoryId (body) no se relaciona nada
  if (categoryIds) {
    // Se convierte el texto que llega en categoryId a un Array
    let ids = categoryIds
      .replace("[", "")
      .replace("]", "")
      .split(",")
      .map((a) => a * 1);
    // Si el resultado de la conversión no es un Array, sale de la función con un mensaje que indica la posible falla
    if (ids instanceof Array) {
      // Si el resultado es un arreglo vacío, sale de la función.
      if (ids.length > 0) {
        // Con el id o los ids ingresados se verifica que correspondan a categoría en la base de datos, si alguno no existe, se descarta el proceso y se retorna un mensaje informándolo.
        const resultsCategories = await Promise.all(
          ids.map((id) => (!Number.isNaN(id) ? readCategory(id) : null))
        );
        if (!resultsCategories.includes(null)) {
          // Si los ids existen, se agrega la relación del producto a las categorías que correspondan con los ids ingresados
          await product.setCategories(resultsCategories);
        } else {
          msg =
            "Any of the categoryId values is not a number, or the text is badly constructed, or categoryId do not exist in database";
        }
      }
    } else {
      msg = "CategoryId must be a String of the form [1,2,3, ..]";
    }
  } else {
    msg = "Did not attach any category";
  }
  return msg;
};

const getProductById = async (id) => {
  return await Product.findOne({
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
};

module.exports = {
  addCategoriesToProduct,
  // readCategory,
  getProductById,
};
