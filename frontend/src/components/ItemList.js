import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';  // Import Link for navigation
import './Item.css';
function ItemList() {
    const [items, setItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [categories, setCategories] = useState([]);
    const [users, setUsers] = useState({});

    // Fetch items and users data
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch items
                const itemsResponse = await axios.get('http://localhost:8080/api/items');
                setItems(itemsResponse.data);
                setFilteredItems(itemsResponse.data);

                // Extract categories from items
                const allCategories = new Set(itemsResponse.data.flatMap(item => item.category));
                setCategories(Array.from(allCategories));

                // Fetch users (sellers)
                const usersResponse = await axios.get('http://localhost:8080/api/users');
                const usersData = usersResponse.data.reduce((acc, user) => {
                    acc[user._id] = user; // Store users by their userId
                    return acc;
                }, {});
                setUsers(usersData);
            } catch (err) {
                setError('Error fetching items or users');
                console.error(err); // Log the error for more insights
            }
        };

        fetchData();
    }, []);

    // Filter items based on search and category selection
    useEffect(() => {
        filterItems();
    }, [searchTerm, selectedCategories]);

    const filterItems = () => {
        let filtered = items;

        if (searchTerm) {
            filtered = filtered.filter((item) =>
                item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (selectedCategories.length > 0) {
            filtered = filtered.filter(item =>
                item.category.some(cat => selectedCategories.includes(cat))
            );
        }

        setFilteredItems(filtered);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleCategoryChange = (e) => {
        const category = e.target.value;
        setSelectedCategories(prev =>
            prev.includes(category)
                ? prev.filter(item => item !== category)
                : [...prev, category]
        );
    };

    if (error) {
        return <div className="text-red-500 text-center mt-6">{error}</div>;
    }

    return (
        <div className="container">
            <h1 className="title">Items List</h1>
            <div>
                <input
                    className="searchitems"
                    type="text"
                    placeholder="Search items..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
            </div>
            <div className="category-filter">
                <h2>Filter by Categories</h2>
                <div className="category-options">
                    {categories.map((category) => (
                        <label key={category} className="category-label">
                            <input
                                type="checkbox"
                                value={category}
                                onChange={handleCategoryChange}
                                className="category-checkbox"
                            />
                            <span>{category}</span>
                        </label>
                    ))}
                </div>
            </div>
            <div className="items-grid">
                {filteredItems.map((item) => {
                    console.log(item.sellerId);
                    const seller = item.sellerId || { firstName: 'Unknown' };
                    return (
                        <div key={item._id} className="item-card">
                            <div className="item-image">
                                <img
                                    src={item.imageurl || 'https://via.placeholder.com/300'}
                                    alt={item.name}
                                />
                            </div>
                            <h2 className="item-title">{item.name}</h2>
                            <p className="item-description">{item.description}</p>
                            <p className="item-price">Price: ₹{item.price}</p>
                            <p className="item-category">Categories: {item.category.join(', ')}</p>
                            <p className="item-seller">Seller: {seller.firstName}</p>
                            <Link to={`/items/${item._id}`} className="viewdetails">
                                View Details
                            </Link>
                        </div>
                    );
                })}
            </div>
        </div>

    );
}

export default ItemList;
