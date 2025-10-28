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

function App() {
  return (
    <>
      {" "}
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />

        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route path="/verify-email/:token" element={<VerifyEmail />} />
        <Route
          path="/request-password-reset"
          element={<RequestPasswordReset />}
        />
        <Route
          path="/reset-password/:userId/:token"
          element={<ResetPassword />}
        />

        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/kitchen-dashboard"
          element={
            <ProtectedRoute allowedRoles={["kitchen"]}>
              <KitchenDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/waiter-dashboard"
          element={
            <ProtectedRoute allowedRoles={["waiter"]}>
              <WaiterDashboard />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App;
