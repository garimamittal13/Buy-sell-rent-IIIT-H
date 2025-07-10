const express = require('express');
const mongoose = require('mongoose');
const Order = require('../models/order'); // The Order schema model
const User = require('../models/user');
const Item = require('../models/item'); 
const router = express.Router();
const crypto = require('crypto');

// Place an order and generate OTP
router.post('/', async (req, res) => {
    console.log('Received order data:', req.body);
    const { buyerId, description, itemId, itemName, price, sellerId }  = req.body;
    if (!buyerId || !sellerId || !itemId || !itemName ) {
        return res.status(400).json({ message: 'All fields are required.' });
    }
    try {
        const order = new Order({
            buyerId,
            sellerId,
            itemId,
            amount: price,
            otpHash: '',
            status: 'pending', // Hardcoded OTP hash for now
        });
        
        const { otp, otpHash } = order.generateOTP();
        order.otpHash = otpHash;
        await order.save();
        res.status(201).json({ message: 'Order placed successfully!', order });
    } catch (error) {
        console.error('Error placing the order:', error);
        res.status(500).json({ error: 'Failed to place the order' });
        
    }

 
});

router.get("/seller", async (req, res) => {
    try {
        const surrsellerId = req.query.sellerId;
        console.log(surrsellerId) // Replace with seller ID from authentication middleware
        const orders = await Order.find({ sellerId : surrsellerId, status: "pending" })
            .populate("buyerId", "firstName") // Fetch buyer details
            .populate("itemId", "name price description") // Fetch item details
            .sort({ createdAt: -1 }) // Sort by most recent orders
            .exec();
    console.log(orders)
        const formattedOrders = orders.map((order) => ({
            _id: order._id,
            buyerName: order.buyerId.firstName,
            itemname: order.itemId.name,
            amount: order.amount, // Include the item name for clarity
        }));
        console.log(formattedOrders);
        res.json({ orders: formattedOrders });
    } catch (error) {
        console.error("Error fetching seller orders:", error);
        res.status(500).json({ error: "Failed to fetch orders" });
    }
});

router.post("/complete", async (req, res) => {
    console.log(req.body);
    try {
        const { orderId, otp } = req.body;

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }

        // Verify the OTP
        const otpHash = crypto.createHash("sha256").update(otp.toString()).digest("hex");
        console.log(otpHash);
        if (order.otpHash !== otpHash) {
            return res.status(400).json({ error: "Incorrect OTP" });
        }

        // Mark the order as completed
        order.status = "completed";
        await order.save();

        res.status(200).json({ message: "Transaction completed successfully" });
    } catch (error) {
        console.error("Error completing transaction:", error);
        res.status(500).json({ error: "Failed to complete the transaction" });
    }
});

// Get pending orders
router.get('/pending/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const orders = await Order.find({ buyerId: userId, status: 'pending' })
            .populate('itemId', 'name price description')
            .populate('sellerId', 'firstName lastName email')
            .populate('buyerId', 'firstName lastName email')
            .sort({ createdAt: -1 })
            .exec();
            // console.log(orders);
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

// Get bought orders
router.get('/bought/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const orders = await Order.find({ buyerId: userId, status: 'completed' })
        .populate('itemId', 'name price description')
        .populate('sellerId', 'firstName lastName email')
        .populate('buyerId', 'firstName lastName email')
        .sort({ createdAt: -1 })
        .exec();
        // console.log(orders);
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

// Get sold orders
router.get('/sold/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const orders = await Order.find({ sellerId: userId, status: 'completed' })
        .populate('itemId', 'name price description')
        .populate('sellerId', 'firstName lastName email')
        .populate('buyerId', 'firstName lastName email')
        .sort({ createdAt: -1 })
        .exec();
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});
router.post("/:orderId/otp", async (req, res) => {
    console.log("this is how we come here");
    console.log(req.params );
    try {
        const { orderId } = req.params;

        // Find the order by its ID
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        // Generate a new OTP and hash it
        const { otp, otpHash } = order.generateOTP();

        // Update the database with the new hashed OTP
        order.otpHash = otpHash;
        await order.save();

        // Send the plain OTP back to the client
        return res.status(200).json({ otp, message: "OTP refreshed successfully." });
    } catch (error) {
        console.error("Error reflashing OTP:", error);
        return res.status(500).json({ message: "Server error. Please try again later." });
    }
});

module.exports = router;
