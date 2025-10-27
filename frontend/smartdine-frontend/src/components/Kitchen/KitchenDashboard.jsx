import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function KitchenDashboard() {
  const { user, logout } = useContext(AuthContext);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Kitchen Dashboard</h2>
      <p>Welcome, {user?.role}!</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
