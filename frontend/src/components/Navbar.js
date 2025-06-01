// frontend/src/components/Navbar.js
import { Link } from "react-router-dom";
import styles from "./Navbar.module.css";
import { useState } from "react";

const Navbar = () => {

    const [isOpen, setIsOpen] = useState(false);

    const handleToggle = () => setIsOpen(!isOpen);
    const handleClose = () => setIsOpen(false);

    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.reload(); // Redirect to login page after logout
    };

    return (
        <>
            {/* Hamburger Icon */}
            <div className={styles.hamburger} onClick={handleToggle}>
                <div></div>
                <div></div>
                <div></div>
            </div>

            {/* Sidebar Nav */}
            <nav className={`${styles.navbar} ${isOpen ? styles.open : ""}`}>
                <h2 className={styles.sitename}><Link to="/" onClick={handleClose}>BUY-SELL@IIITH</Link></h2>
                <ul>
                    <li><Link to="/" onClick={handleClose}>Profile</Link></li>
                    <li><Link to="/upload-item" onClick={handleClose}>Upload Item</Link></li>
                    <li><Link to="/items" onClick={handleClose}>Items</Link></li>
                    <li><Link to="/cart" onClick={handleClose}>My cart</Link></li>
                    <li><Link to="/orders" onClick={handleClose}>Order History</Link></li>
                    <li><Link to="/deliver" onClick={handleClose}>Delivery</Link></li>
                </ul>
                <button className={styles.logout_btn} onClick={() => { handleLogout(); handleClose(); }}>
                    Logout
                </button>
            </nav>
        </>
    );
};

export default Navbar;
