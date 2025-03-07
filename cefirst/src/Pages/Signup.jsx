import { useNavigate } from "react-router-dom";
// import sofa from "../assets/picc2.jpg";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useLoader } from '../context/LoaderContext';
import './Login.css';


function Signup(props) {
    const { setIsloggesIn } = props; 
    // console.log("++++++++" + setIsloggesIn);
    const navigate = useNavigate();
    const { setLoading } = useLoader(); 


    async function submitHandler(event) {
        event.preventDefault();
        const name = event.target.name.value;
        const email = event.target.email.value;
        const password = event.target.password.value;
        const confirmPassword = event.target.confirmPassword.value;
    
        if (password !== confirmPassword) {
            toast.error("Passwords do not match!");
            return;
        }
        // console.log("Entered function");
        try {
            setLoading(true);
            // console.log("Entered try");
            const response = await fetch('http://localhost:5000/api/v1/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, password }),
                credentials: 'include'  // If dealing with authentication (cookies, sessions)
            });
            // console.log("Entered");
    
            const resData = await response.json();
    
            if (!response.ok) {
                throw new Error(resData.message || "Something went wrong");
            }
    
            // Send OTP request
            await fetch('http://localhost:5000/api/v1/send-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email }),
                credentials: 'include'
            });
    
            navigate("/otp-verification", { state: { email }, setIsloggesIn });
    
            if (resData.success) {
                localStorage.setItem('email', email);
            }
    
            toast.success("OTP Sent!", {
                style: {
                    backgroundColor: '#fff',
                    color: '#000',
                }
            });
        } catch (error) {
            toast.error(error.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    }
    

    return (
        <div className="login-page-div">
            <form onSubmit={submitHandler}>
                <div className="login-box">
                    <div className="h3-login">Welcome Back</div>
                    <p className="login-para">Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis, laborum!</p>
                    <div className="label-input">
                        <label htmlFor="email" className="label email-label">Email Address</label>
                        <input type="email" name="email" required className="input-class" placeholder="Email" />
                        <label htmlFor="name" className="label name-label">Name</label>
                        <input type="text" name="name" required className="input-class" placeholder="Name" />
                        <label htmlFor="password" className="label pass-label">Password</label>
                        <input type="password" name="password" required className="input-class" placeholder="Password" />
                        <label htmlFor="confirmPassword" className="label pass-label">Confirm Password</label>
                        <input type="password" name="confirmPassword" required className="input-class" placeholder="Confirm Password" />
                    </div>
                    <div className="btn-div">
                        <Link to="/forgot-password" className="forgot-pass-btn">Forgot Password</Link>
                        <button type="submit" className="login-page-btn">Sign Up</button>
                        <hr className="hr-page" />
                        <button type="button" className="login-with-google">Sign in with Google</button>
                    </div>
                </div>
            </form>
            {/* <div className="sofa-login"> */}
                {/* <img src={sofa} alt="Sofa" className="sofa-login-img" />
            </div> */}
        </div>
    );
}

export default Signup;
