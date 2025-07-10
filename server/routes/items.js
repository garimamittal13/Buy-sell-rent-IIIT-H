// routes/items.js
const express = require("express");
const Item = require("../models/item");
const Order = require("../models/order");
const authMiddleware = require("../middleware/auth");
const router = express.Router();

// Get all items
router.get("/", async (req, res) => {
    try {
        const orders = await Order.find({}, "itemId"); // Assuming "itemId" field stores ordered item IDs
        const orderedItemIds = orders.map(order => order.itemId);

        // Find all items excluding those that are in the orderedItemIds
        const items = await Item.find({ _id: { $nin: orderedItemIds } })
            .populate("sellerId", "firstName lastName email");
        res.status(200).json(items);
    } catch (err) {
        console.error("Error in /api/items:", err);
        res.status(500).json({ error: "Error retrieving items." });
    }
});

// Create a new item
router.post("/", authMiddleware, async (req, res) => {
    try {
        console.log(req.body);
        const { name, price, description, category, imageUrl } = req.body;
        console.log(imageUrl);
        // Validate the input
        if (!name || !price || !description || !category) {
            return res.status(400).json({ message: "All fields are required." });
        }
    
        // Create the new item
        const item = new Item({
            name,
            price,
            description,
            category: category.split(",").map((cat) => cat.trim()), // Convert categories into an array
            sellerId: req.user._id,
            imageurl: imageUrl || "", // Handle case where imageurl might not be provided
        });
    
        await item.save();
    
        res.status(201).json({ message: "Item created successfully!", item });
    } catch (err) {
        console.error("Error in POST /api/items:", err);
        res.status(500).json({ error: "Failed to create the item." });
    }
});
    
// Get item by ID
// Get an item by ID
router.get("/:id", async (req, res) => {
    try {
        const item = await Item.findById(req.params.id).populate(
            "sellerId",
            "firstName lastName email"
        ); // Populate seller details
        if (!item) {
            return res.status(404).json({ error: "Item not found" });
        }
        res.status(200).json(item);
    } catch (err) {
        console.error("Error in GET /api/items/:id:", err);
        res.status(500).json({ error: "Failed to retrieve the item" });
    }
});

module.exports = router;
