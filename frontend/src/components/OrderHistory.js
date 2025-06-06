import React, { useState, useEffect } from "react";
import axios from "axios";
import {jwtDecode} from 'jwt-decode'; // Import jwt-decode
import "./OrderHistory.css"
function OrderHistory() {
    const [pendingOrders, setPendingOrders] = useState([]);
    const [boughtOrders, setBoughtOrders] = useState([]);
    const [soldOrders, setSoldOrders] = useState([]);
    const [currentUserId, setCurrentUserId] = useState(null);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState("pending");
    const [otpFlash, setOtpFlash] = useState({});
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem("token");

                if (!token) {
                    setError("User not authenticated. Please log in.");
                    return;
                }

                const decoded = jwtDecode(token); // Decode the token to get user ID
                setCurrentUserId(decoded._id);
                console.log(decoded._id);
                // Fetch pending orders
                const pendingResponse = await axios.get(`http://localhost:8080/api/orders/pending/${decoded._id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setPendingOrders(pendingResponse.data);
                console.log(pendingResponse.data);
                // Fetch bought orders
                const boughtResponse = await axios.get(`http://localhost:8080/api/orders/bought/${decoded._id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setBoughtOrders(boughtResponse.data);
                console.log(boughtResponse.data);
                // Fetch sold orders
                const soldResponse = await axios.get(`http://localhost:8080/api/orders/sold/${decoded._id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setSoldOrders(soldResponse.data);
            } catch (err) {
                setError("Error fetching orders. Please try again later.");
                console.error(err);
            }
        };

        fetchOrders();
    }, []);
    const reflashOtp = async (orderId) => {
        try {
            console.log(orderId);
            const response = await axios.post(
                `http://localhost:8080/api/orders/${orderId}/otp`
            );
            const { otp } = response.data;

            // Temporarily store OTP in the otpFlash state
            setOtpFlash((prev) => ({ ...prev, [orderId]: otp }));

            // Remove the OTP after 10 seconds
            setTimeout(() => {
                setOtpFlash((prev) => {
                    const updatedFlash = { ...prev };
                    delete updatedFlash[orderId];
                    return updatedFlash;
                });
            }, 1000);
        } catch (err) {
            console.error("Error reflashing OTP:", err);
            setError("Failed to reflash OTP. Please try again.");
        }
    };

    if (error) {
        return <div className="error">{error}</div>;
    }
    const renderTabContent = () => {
        switch (activeTab) {
            case "pending":
            return (
                <div className="container">
                    <h2 className="pending-title">Pending Orders</h2>
                    <div className="pending-orders-container">
                        {pendingOrders.map((order) => (
                            <div key={order._id} className="pending-order-card">
                                <p>Transaction ID: {order._id}</p>
                                <p>Buyer Name: {order.buyerId.firstName}</p>
                                <p>Buyer Email: {order.buyerId.email}</p>
                                <p>Seller Name: {order.sellerId.firstName}</p>
                                <p>Item Name: {order.itemId.name}</p>
                                <p>Amount: ₹{order.amount}</p>
            
                                {/* Show OTP if available */}
                                {otpFlash[order._id] ? (
                                    <p className="otp-text">OTP: {otpFlash[order._id]}</p>
                                ) : (
                                    <button
                                        onClick={() => reflashOtp(order._id)}
                                        className="otp-btn"
                                    >
                                        Show OTP
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            );
                
            case "bought":
                return (
                    <div className="container">
                        <h2 className="bought-title">Bought Orders</h2>
                        <div className="bought-orders-container">
                            {boughtOrders.map((order) => (
                                <div key={order._id} className="bought-order-card">
                                    <p>Transaction ID: {order._id}</p>
                                    <p>Buyer Name: {order.buyerId.firstName}</p>
                                    <p>Buyer Email: {order.buyerId.email}</p>
                                    <p>Seller Name: {order.sellerId.firstName}</p>
                                    <p>Item Name: {order.itemId.name}</p>
                                    <p>Amount: ₹{order.amount}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case "sold":
                return (
                    <div className="container">
                        <h2 className="sold-title">Sold Orders</h2>
                        <div className="sold-orders-container">
                            {soldOrders.map((order) => (
                                <div key={order._id} className="sold-order-card">
                                    <p>Transaction ID: {order._id}</p>
                                    <p>Buyer Name: {order.buyerId.firstName}</p>
                                    <p>Buyer Email: {order.buyerId.email}</p>
                                    <p>Seller Name: {order.sellerId.firstName}</p>
                                    <p>Item Name: {order.itemId.name}</p>
                                    <p>Amount: ₹{order.amount}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                );
                
            default:
                return null;
        }
    };
    return (
        <div className="hi">
            <h1 className="orderhistory">Order History</h1>

            {/* Tabs */}
            <div className="tab-container">
            <button
                className={`tab-btn ${activeTab === "pending" ? "active" : ""}`}
                onClick={() => setActiveTab("pending")}
            >
            Pending Orders
            </button>
            <button
                className={`tab-btn ${activeTab === "bought" ? "active" : ""}`}
                onClick={() => setActiveTab("bought")}
            >
                Bought Orders
            </button>
            <button
                className={`tab-btn ${activeTab === "sold" ? "active" : ""}`}
                onClick={() => setActiveTab("sold")}
            >
                Sold Orders
            </button>
        </div>


            {/* Tab Content */}
            {renderTabContent()}
        </div>
    );
}

export default OrderHistory;
