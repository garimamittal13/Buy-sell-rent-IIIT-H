import React, { useState, useEffect } from "react";
import axios from "axios";
import {jwtDecode} from "jwt-decode"; // Remove curly braces
import { useParams } from "react-router-dom";
import "./DeliverItems.css"
function DeliverItems() {
    const [orders, setOrders] = useState([]);
    const [otpInputs, setOtpInputs] = useState({}); // Object to store OTPs per order
    const [message, setMessage] = useState("");

    useEffect(() => {
        // Fetch pending orders for the seller
        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem("token");
                let currentUserId = null;
                if (token) {
                    const decoded = jwtDecode(token);
                    currentUserId = decoded._id;
                }
                console.log("Current User ID:", currentUserId);
                const response = await axios.get("/api/orders/seller", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    params: {
                        sellerId: currentUserId,
                    },
                });

                setOrders(response.data.orders);
            } catch (error) {
                console.error("Error fetching orders:", error);
            }
        };

        fetchOrders();
    }, []);

    const handleCompleteTransaction = async (orderId) => {
        try {
            const otp = otpInputs[orderId];
            console.log(otp);
            console.log(orderId); // Get OTP for the specific order
            const response = await axios.post(`/api/orders/complete`, {
                orderId,
                otp,
            });

            if (response.status === 200) {
                // Remove completed order from the list
                setOrders((prevOrders) => prevOrders.filter((order) => order._id !== orderId));
                setMessage("Transaction completed successfully!");
            } else {
                setMessage("Failed to complete the transaction. OTP might be incorrect.");
            }
        } catch (error) {
            console.error("Error completing transaction:", error);
            setMessage("Failed to complete the transaction.");
        }

        // Clear the OTP input for the specific order
        setOtpInputs((prev) => ({ ...prev, [orderId]: "" }));
    };

    const handleOtpChange = (orderId, value) => {
        setOtpInputs((prev) => ({
            ...prev,
            [orderId]: value, // Update the OTP for the specific order
        }));
    };

    return (
        <div className="deliver-container">
            <h1 className="deliver-title">Deliver Items</h1>
            {message && <p className="message">{message}</p>}
            {orders.length === 0 ? (
                <p className="no-orders">No pending orders to deliver.</p>
            ) : (
                <div className="orders-wrapper">
                    {orders.map((order) => (
                        <div key={order._id} className="order-card">
                            <h2 className="order-title">{order.itemName}</h2>
                            <p className="order-details">Price: ₹{order.amount}</p>
                            <p className="order-details">Buyer: {order.buyerName}</p>
                            <p className="order-details">Item name: {order.itemname}</p>
                            <div className="otp-section">
                                <input
                                    type="text"
                                    value={otpInputs[order._id] || ""}
                                    onChange={(e) => handleOtpChange(order._id, e.target.value)}
                                    placeholder="Enter OTP"
                                    className="otp-input"
                                />
                                <button
                                    onClick={() => handleCompleteTransaction(order._id)}
                                    className="complete-btn"
                                >
                                    Complete Transaction
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>

    );
}

export default DeliverItems;
