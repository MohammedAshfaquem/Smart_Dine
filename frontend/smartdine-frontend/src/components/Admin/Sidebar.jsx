export default function Sidebar({ setActiveTab, activeTab }) {
  return (
    <div style={{ width: "200px", background: "#333", color: "#fff", padding: "20px" }}>
      <h3>Admin Dashboard</h3>
      <div
        onClick={() => setActiveTab("requests")}
        style={{
          margin: "10px 0",
          cursor: "pointer",
          fontWeight: activeTab === "requests" ? "bold" : "normal",
        }}
      >
        Requests
      </div>
      {/* Add more tabs here */}
    </div>
  );
}
