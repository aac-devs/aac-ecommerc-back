require("dotenv").config();
const {
  DB_HOST,
  DB_DATABASE,
  DB_USERNAME,
  DB_PASSWORD,
  DB_DIALECT,
} = process.env;

module.exports = {
  // Conexión:
  username: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  host: DB_HOST,
  dialect: DB_DIALECT,
  logging: false,

  // Tabla en DB
  seederStorage: "sequelize",
  // seederStoragePath: "sequelizeData.json",
  seederStorageTableName: "sequelize_data",

  define: {
    timestamps: false,
    underscored: true,
  },
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
};
