const { Schema, model } = require("mongoose");

const CategorySchema = Schema({
  name: {
    type: String,
    required: [true, "[DB] Name is required"],
    unique: true,
  },
  description: {
    type: String,
  },
});

module.exports = model("Category", CategorySchema);
