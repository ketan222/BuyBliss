import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "./OtpVerification.css"; 

function OtpVerification({ setIsloggesIn }) {
  const [otp, setOtp] = useState("");
  const [isResendDisabled, setIsResendDisabled] = useState(false);
  const [resendTimeout, setResendTimeout] = useState(30); // Resend timeout in seconds
  const location = useLocation();
  const navigate = useNavigate();
  const { email } = location.state || {};

  useEffect(() => {
    let timer;
    if (isResendDisabled && resendTimeout > 0) {
      timer = setInterval(() => {
        setResendTimeout((prev) => prev - 1);
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [isResendDisabled, resendTimeout]);

  async function submitHandler(event) {
    event.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/v1/verify-otp", { email, otp });
      toast.success("OTP Verified! Logging you in...");
      localStorage.setItem("token", res.data.token);
      setIsloggesIn(true);
      navigate("/");
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Invalid OTP, please try again.";
      toast.error(errorMessage);
    }
  }

  async function resendOtpHandler() {
    try {
      setIsResendDisabled(true);
      setResendTimeout(30); // Reset the timer
      await axios.post("http://localhost:5000/api/v1/send-otp", { email });
      toast.success("OTP resent successfully!");
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to resend OTP.";
      toast.error(errorMessage);
    }
  }

  return (
    <div className="otp-verification">
      <form onSubmit={submitHandler} className="otp-form">
        <h3>Enter OTP</h3>
        <p>We have sent an OTP to {email}</p>
        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter OTP"
          required
          className="otp-input"
        />
        <button type="submit" className="otp-submit-btn">Verify OTP</button>
        <button
          type="button"
          className="resend-otp-btn"
          onClick={resendOtpHandler}
          disabled={isResendDisabled}
        >
          {isResendDisabled ? `Resend in ${resendTimeout}s` : "Resend OTP"}
        </button>
      </form>
    </div>
  );
}

export default OtpVerification;
