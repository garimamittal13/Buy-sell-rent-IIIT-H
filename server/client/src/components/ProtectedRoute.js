// frontend/src/components/ProtectedRoute.js
import { Outlet, Navigate } from "react-router-dom";
import Navbar from "./Navbar";
const ProtectedRoute = () => {
    const token = localStorage.getItem("token");

    if (!token) {
        return <Navigate to="/login" />;
    }
    // const {userId} = jwtDecode(token);

    return (
        <div>
            <Navbar />
            <Outlet  />
        </div>
    );
};

export default ProtectedRoute;
