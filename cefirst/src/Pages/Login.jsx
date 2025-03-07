import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useLoader } from '../context/LoaderContext';
import './Login.css';
import sofa from '../assets/picc2.jpg';

function Login(props) {
  const { setIsloggesIn } = props;
  const navigate = useNavigate();
  const { setLoading } = useLoader(); 

  async function submitHandler(event) {
    event.preventDefault();
    const email = event.target.email.value;
    const password = event.target.password.value;

    try {
      setLoading(true); 
      const res = await axios.post("http://localhost:5000/api/v1/login", { email, password });
      console.log("OTP sent to:", email);
      await axios.post('http://localhost:5000/api/v1/send-otp', { email });
      if(res.data.success){
        localStorage.setItem('email',email);
      }
      navigate("/otp-verification", { state: { email  }  });
      toast.success("OTP sent to your email. Please verify.", {
        style: { backgroundColor: "#fff", color: "#000" },
      });
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Login failed, please try again.";
      toast.error(errorMessage, {
        style: { backgroundColor: "#fff", color: "#000" },
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page-div1">
      <div className="login-page-div">
        <form onSubmit={submitHandler}>
          <div className="login-box">
            <div className="h3-login">Welcome Back</div>
            <p className="login-para">Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis, laborum!</p>
            <div className="label-input">
              <label htmlFor="email" className="label email-label">Email Address</label>
              <input type="email" name="email" required className="input-class" placeholder="Email" />
              <label htmlFor="password" className="label pass-label">Password</label>
              <input type="password" name="password" required className="input-class" placeholder="Password" />
            </div>
            <div className="btn-div">
              <button type="submit" className="login-page-btn">Log in</button>
            </div>
          </div>
        </form>
        {/* <div className="sofa-login">
          <img src={sofa} alt="Sofa" className="sofa-login-img" />
        </div> */}
      </div>
    </div>
  );
}

export default Login;
