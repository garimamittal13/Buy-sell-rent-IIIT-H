import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import "./Cart.css";

function Cart() {
    const [cart, setCart] = useState([]);
    const [orderSuccess, setOrderSuccess] = useState(false);

    useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
        setCart(storedCart);
    }, []);

    const removeFromCart = (id) => {
        const updatedCart = cart.filter((item) => item.id !== id);
        setCart(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
    };

    const calculateTotal = () => {
        return cart.reduce((total, item) => total + item.price, 0);
    };

    const handleOrder = async () => {
        try {
            const token = localStorage.getItem("token");
            let currentUserId = null;
            if (token) {
                const decoded = jwtDecode(token);
                currentUserId = decoded._id;
            }

            if (!currentUserId) {
                alert("Please login to place the order");
                return;
            }

            for (const item of cart) {
                const orderData = {
                    buyerId: currentUserId,
                    sellerId: item.sellerId,
                    itemId: item.id,
                    itemName: item.name,
                    price: item.price,
                    description: item.description,
                };

                const response = await fetch("http://localhost:8080/api/orders", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(orderData),
                });

                if (!response.ok) {
                    console.log("Error placing order for", item.name);
                }
            }

            setCart([]);
            localStorage.setItem("cart", JSON.stringify([]));
            setOrderSuccess(true);
        } catch (error) {
            console.error("Error placing the order:", error);
            setOrderSuccess(false);
        }
    };

    if (orderSuccess) {
        return <div className="order-success"><h2>Your order has been placed successfully!</h2></div>;
    }

    if (cart.length === 0) {
        return (
            <div className="empty">
                <h1>My Cart</h1>
                <h2>Your cart is empty.</h2>
            </div>
        );
    }

    return (
        <div className="cartcontainer">
            <h1 className="mycart">My Cart</h1>
            <div className="cart-container">
                {cart.map((item) => (
                    <div key={item.id} className="cart-item">
                        <h2 className="itemnamecart">{item.name}</h2>
                        <p className="description">{item.description}</p>
                        <p className="price">Price: ₹{item.price}</p>
                        <button onClick={() => removeFromCart(item.id)} className="remove-btn">
                            Remove
                        </button>
                    </div>
                ))}
            </div>
            <div className="totalcostcart">
                <p>Total Cost: ₹{calculateTotal()}</p>
            </div>

            <div className="finalorder">
                <button onClick={handleOrder} className="finalordercart">Final Order</button>
            </div>
        </div>
    );
}

export default Cart;
