const { request, response } = require("express");

module.exports = {
  isAllowExtension: async (req = request, res = response, next) => {
    const allowedExtensions = ["png", "jpg", "jpeg", "gif"];
    let files = [];
    const aux = req.files?.files || req.files || [];
    aux instanceof Array ? (files = aux) : files.push(aux);

    if (files !== []) {
      const extensions = files.map((file) => {
        const name = file.name.split(".");
        return name[name.length - 1];
      });
      const excludedExtension = extensions.filter(
        (ext) => !allowedExtensions.includes(ext)
      );
      if (excludedExtension.length > 0) {
        return res.status(400).json({
          msg: `File invalid!, allowed extensions are:${allowedExtensions.map(
            (ext) => " " + ext
          )}`,
        });
      }
    }
    req.filesValidate = files;
    next();
  },
};
