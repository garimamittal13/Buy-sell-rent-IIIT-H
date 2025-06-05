import { useState } from "react";
import axios from "axios";
import './UploadItem.css'; // Import the custom CSS file

const UploadItem = () => {
    const [formData, setFormData] = useState({
        name: "",
        price: "",
        description: "",
        category: "",
        imageUrl: "", // Added field for image URL
    });

    const [isUploading, setIsUploading] = useState(false);

    const handleChange = ({ currentTarget: input }) => {
        setFormData({ ...formData, [input.name]: input.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsUploading(true);

        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("User not authenticated");

            // Set default image if none is provided
            const updatedFormData = {
                ...formData,
                imageUrl: formData.imageUrl.trim() || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSAAja6c9Ip37JMYpOmIIe9JGv16LvccS2OoCpr2Evz5Gv2-ImNwePvBoxNWctyWlJwYmA&usqp=CAU",
            };

            const response = await axios.post(
                "http://localhost:8080/api/items",
                updatedFormData,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            alert("Item uploaded successfully!");
            console.log("Uploaded Item:", response.data);

            // Reset form after successful upload
            setFormData({
                name: "",
                price: "",
                description: "",
                category: "",
                imageUrl: "", // Reset image URL field
            });
        } catch (error) {
            console.error("Error uploading item:", error);
            alert("Failed to upload the item. Please try again.");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="upload-container">
            <div className="upload-form">
                <h1 className="form-title">Upload an Item</h1>
                <form onSubmit={handleSubmit} className="form-fields">
                    <div className="form-group">
                        <label htmlFor="name" className="form-label">Item Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="form-input"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="price" className="form-label">Price</label>
                        <input
                            type="number"
                            id="price"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            className="form-input"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description" className="form-label">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="form-input"
                            required
                        ></textarea>
                    </div>

                    <div className="form-group">
                        <label htmlFor="category" className="form-label">Category</label>
                        <input
                            type="text"
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            placeholder="Separate categories with commas"
                            className="form-input"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="imageUrl" className="form-label">Image URL</label>
                        <input
                            type="url"
                            id="imageUrl"
                            name="imageUrl"
                            value={formData.imageUrl}
                            onChange={handleChange}
                            placeholder="Enter image URL"
                            className="form-input"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isUploading}
                        className={`submit-button ${isUploading ? 'disabled' : ''}`}
                    >
                        {isUploading ? "Uploading..." : "Upload Item"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UploadItem;
