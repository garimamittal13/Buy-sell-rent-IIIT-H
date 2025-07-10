import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
 // Import jwt-decode for decoding tokens
import { useParams } from "react-router-dom";
import "./ItemDetail.css";
function ItemDetail() {
    const { id } = useParams();
    const [item, setItem] = useState(null);
    const [error, setError] = useState(null);
    const [currentUserId, setCurrentUserId] = useState(null); // Track the current user ID

    useEffect(() => {
        const fetchItemDetail = async () => {
            try {
                const token = localStorage.getItem("token");
                if (token) {
                    const decoded = jwtDecode(token); // Decode the token to get the user ID
                    setCurrentUserId(decoded._id);
                }

                const itemResponse = await axios.get(`/api/items/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setItem(itemResponse.data);
            } catch (err) {
                setError("Error fetching item details");
                console.error(err);
            }
        };

        fetchItemDetail();
    }, [id]);
    const addToCart = () => {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        const isItemInCart = cart.some((cartItem) => cartItem.id === item._id);

        if (isItemInCart) {
            alert("This item is already in your cart!");
            return;
        }

        cart.push({
            id: item._id,
            name: item.name,
            price: item.price,
            description: item.description,
            sellerId: item.sellerId._id,
        });

        localStorage.setItem("cart", JSON.stringify(cart));
        alert("Item added to cart!");
    };
    if (error) {
        return <div className="text-red-500 text-center mt-6">{error}</div>;
    }
    if (!item) {
        return <div>Loading...</div>;
    }
    return (
        <div className = "container">
            <h1 className="itemname">{item.name}</h1>
            <div className="itemdetail">
                <div className = "type">
                    <h2 className="destitle">Description</h2>
                    <p className="des">{item.description}</p>
                    <p className="name">Price: ₹{item.price}</p>
                    <p className="category">Categories: {item.category.join(", ")}</p>
                </div>
                <div className="type">
                    <h2 className="seller">Seller Information:</h2>
                    <p className="name">
                        Name: {item.sellerId.firstName} {item.sellerId.lastName}
                    </p>
                    <p className="name">Email: {item.sellerId.email}</p>
                </div>
            </div>
                {item.sellerId._id === currentUserId ? (
                    <p className = "no">This item is being sold by you.</p>
                ) : (
                    <button
                        className="add-to-cart"
                        onClick={addToCart}
                    >
                        Add to Cart
                    </button>
                )}
        </div>
    );
}

export default ItemDetail;
