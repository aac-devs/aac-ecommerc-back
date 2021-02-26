const { Schema, model } = require("mongoose");
const { Category } = require(".");

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

CategorySchema.methods.toJSON = function () {
  const { __v, _id, ...rest } = this.toObject();
  rest.uid = _id;
  return rest;
};

module.exports = model("Category", CategorySchema);
