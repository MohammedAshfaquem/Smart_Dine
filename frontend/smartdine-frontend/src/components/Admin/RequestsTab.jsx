import { useState, useEffect } from "react";

export default function RequestsTab() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
  fetchPendingRequests();
}, []);

const fetchPendingRequests = async () => {
  try {
    const res = await fetch("http://localhost:8000/auth/admin/pending-users/", {
      headers: { "Content-Type": "application/json" },
      credentials: "include", // important if using session auth
    });
    const data = await res.json();
    setRequests(data);
  } catch (err) {
    console.error("Error fetching requests", err);
  }
};


  const approveUser = async (id) => {
    try {
      await fetch(`http://localhost:8000/auth/admin/approve-user/${id}/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      fetchPendingRequests();
    } catch (err) {
      console.error("Error approving user", err);
    }
  };

  return (
    <div>
      <h2>Pending Staff Requests</h2>
      <table border="1" cellPadding="10" style={{ width: "100%", textAlign: "left" }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.length === 0 ? (
            <tr>
              <td colSpan="4">No pending requests</td>
            </tr>
          ) : (
            requests.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <button onClick={() => approveUser(user.id)}>Approve</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
