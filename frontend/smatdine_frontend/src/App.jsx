import { Routes, Route, Navigate } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import VerifyEmail from "./components/VerifyEmail";
import ResetPassword from "./components/ResetPassword";
import AdminDashboard from "./components/Admin/AdminDashboard";
import KitchenDashboard from "./components/Kitchen/KitchenDashboard";
import WaiterDashboard from "./components/Waiter/WaiterDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TablePage from "./components/customer/TablePage";
import CustomerDashboard from "./components/customer/CustomerDashboard";
import QRPage from "./components/customer/QRPage";
import ForgetPassword from "./components/ForgetPassword";
import ReviewOrder from "./components/customer/ReviewOrder";
import LiveOrders from "./components/customer/LiveOrders";
import OrderTracking from "./components/customer/OrderTracking";
import CustomDishes from "./components/customer/CustomDishes";
import Step1Page from "./components/customer/Step1Page";
import Step2Page from "./components/customer/Step2Page";
import Step3Page from "./components/customer/Step3Page";
import AssistancePage from "./components/customer/AssistancePage";
import { Toaster } from "react-hot-toast";
import Chatbot from "./components/customer/Chatbot";
import AddProductPage from "./components/Admin/AddProductPage";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<QRPage />} />
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
        <Route path="/forget-password" element={<ForgetPassword />} />
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
        <Route path="/table/:tableId" element={<TablePage />} />
        <Route path="/customer/dashboard" element={<CustomerDashboard />} />
        <Route path="/review-order/:tableId" element={<ReviewOrder />} />
        <Route path="/live-orders/:tableId" element={<LiveOrders />} />
        <Route path="/order-tracking/:orderId" element={<OrderTracking />} />
        <Route path="/custom-dishes" element={<CustomDishes />} />
        <Route path="/step1/:tableId" element={<Step1Page />} />
        <Route path="/step2/:tableId" element={<Step2Page />} />
        <Route path="/step3/:tableId" element={<Step3Page />} />
        <Route path="/assistance" element={<AssistancePage />} />
        <Route path="/chatbot" element={<Chatbot />} />
        <Route path="/add-product" element={<AddProductPage />} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      <ToastContainer position="top-right" autoClose={3000} />
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            fontSize: "16px",
            padding: "12px 24px",
            borderRadius: "12px",
            background: "#059669",
            color: "#fff",
          },
        }}
      />
    </>
  );
}

export default App;
