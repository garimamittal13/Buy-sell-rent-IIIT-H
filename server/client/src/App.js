import { Route, Routes, Navigate } from "react-router-dom";
import Signup from "./components/Signup";
import Login from "./components/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import Main from "./components/Main"; // Your profile page component
import ItemList from "./components/ItemList"; // Items page component
import ItemDetail from "./components/ItemDetail"; // Item detail page component
import UploadItem from "./components/UploadItem"; // Upload item page component
import Cart from "./components/Cart";
import OrderHistory from  "./components/OrderHistory";
import DeliverItems from "./components/DeliverItems";
import Chatbot from "./components/Chatbot";
function App() {
    return (
        <>
        <Routes>
            {/* Public routes */}
            <Route path="/signup" exact element={<Signup />} />
            <Route path="/login" exact element={<Login />} />

            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
                <Route path="/" element={<Main />} /> {/* Profile Page */}
                <Route path="/items" element={<ItemList />} /> {/* Items Page */}
                <Route path="/items/:id" element={<ItemDetail />} /> {/* Item Detail Page */}
                <Route path="/upload-item" element={<UploadItem />} /> {/* Upload Item Page */}
                <Route path="/cart" element={<Cart />} /> {/* Cart Page */}
                <Route path="/orders" element={<OrderHistory />} />
                <Route path="/deliver" element={<DeliverItems />} />

            </Route>

            {/* Catch-all route to redirect to login */}
            <Route path="*" element={<Navigate replace to="/login" />} />
        </Routes>
        <Chatbot />
        </>
    );
}

export default App;
