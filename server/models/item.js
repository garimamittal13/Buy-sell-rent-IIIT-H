const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    category: { type: [String], required: true },  // Array to allow multiple categories
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    imageurl: { type: [String], required: false }, 
});

const Item = mongoose.model("Item", itemSchema, "items");

module.exports = Item;
