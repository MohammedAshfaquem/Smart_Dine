import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function VerifyEmail() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState("Verifying your email...");

  useEffect(() => {
    axios
      .get(`http://localhost:8000/auth/staff/verify-email/${token}/`)
      .then((res) => {
        setMessage(res.data.message || "Email verified successfully!");
        setTimeout(() => navigate("/login"), 2000); // Redirect after 2 sec
      })
      .catch((err) => {
        setMessage(err.response?.data?.message || "Invalid or expired token.");
      });
  }, [token, navigate]);

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>{message}</h2>
    </div>
  );
}
