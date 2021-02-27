const express = require("express");
const cors = require("cors");
const sequelize = require("../database/config");

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;

    this.paths = {
      categories: "/products/category",
    };

    // Connect DB
    this.connectDB();

    // Middlewares
    this.middlewares();

    // Routes
    this.routes();
  }

  async connectDB() {
    try {
      await sequelize.sync({ force: false });
      console.log("Postgresql database online");
    } catch (error) {
      console.log(error);
    }
  }

  middlewares() {
    // CORS
    this.app.use(cors());

    // Reading and parse body
    this.app.use(express.json());

    // Public folder
    this.app.use(express.static("public"));
  }

  routes() {
    this.app.use(this.paths.categories, require("../routes/categories"));
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`Server running al http://localhost:${this.port}`);
    });
  }
}

module.exports = Server;
