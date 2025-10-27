import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";


export default function WaiterDashboard() {
  const { user, logout } = useContext(AuthContext);
  return (
    <div style={{ padding: "20px" }}>
      <h2>Waiter Dashboard</h2>
      <p>Welcome, waiter!</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
