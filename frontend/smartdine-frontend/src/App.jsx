import { Routes, Route, Navigate } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import VerifyEmail from "./components/VerifyEmail";
import RequestPasswordReset from "./components/RequestPasswordReset";
import ResetPassword from "./components/ResetPassword";
import AdminDashboard from "./components/Admin/AdminDashboard";
import KitchenDashboard from "./components/Kitchen/KitchenDashboard";
import WaiterDashboard from "./components/Waiter/WaiterDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TablePage from "./components/customer/TablePage";
import CustomerDashboard from "./components/customer/CustomerDashboard";
import QRPage from "./components/customer/QRPage";

function App() {
  return (
    <>
      <Routes>
        {/* 👇 Set this as the first page */}
        <Route path="/" element={<QRPage />} />

        {/* existing routes below */}
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/verify-email/:token" element={<VerifyEmail />} />
        <Route path="/request-password-reset" element={<RequestPasswordReset />} />
        <Route path="/reset-password/:userId/:token" element={<ResetPassword />} />
        <Route path="/admin-dashboard" element={<ProtectedRoute allowedRoles={["admin"]}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/kitchen-dashboard" element={<ProtectedRoute allowedRoles={["kitchen"]}><KitchenDashboard /></ProtectedRoute>} />
        <Route path="/waiter-dashboard" element={<ProtectedRoute allowedRoles={["waiter"]}><WaiterDashboard /></ProtectedRoute>} />

        <Route path="/table/:tableId" element={<TablePage />} />
        <Route path="/customer/dashboard" element={<CustomerDashboard />} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App;
