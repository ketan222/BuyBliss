import sofa from "../assets/sofa.png"
import envelope from "../assets/envelope.svg"
import "./Footer.css"
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useState } from "react";
function Footer(){
    const [data,setData] = useState({name:"",email:""});
    const navigate = useNavigate();
    function submitHandler(event){
        event.preventDefault();
        navigate("/");
        toast.success("Submitted!")
        setData({name:"",email:""});
    }
    function handleInputChange(event) {
        const { name, value } = event.target;
        setData(prevData => ({
            ...prevData,
            [name]: value
        }));
    }
    return(
        <div className="footer">
            <div className="subscibe">
                <div className="footer-sofa">
                    {/* <form className="form-footer">
                        <div className="main-head">
                            <img src={envelope} alt="" className="envelope" />
                            <p className="subscribe-heading">Subscribe to   Newsletter</p>
                        </div>
                        <input type="text"
                        placeholder="Enter your name"
                        required className="input1"
                        value={data.name}
                        name="name"
                        onChange={handleInputChange}/>
                        <input type="email"
                        name="email"
                        placeholder="Enter your email"
                        required className="input2" value={data.email}
                        onChange={handleInputChange}/>
                        <button className="btn-form" onClick={submitHandler}>Submit</button>
                    </form> */}
                    {/* <img src={sofa} alt="" className="sofa" /> */}
                </div>
                <div className="footer-bottom">
                    <h4 className="footer-bottom-heading">BuyBliss</h4>
                    <div className="footer-bottom-sections">
                        <p className="footer-bottom-sections1">Donec facilisis quam ut purus rutrum lobortis. Donec vitae odio quis nisl dapibus malesuada. Nullam ac aliquet velit. Aliquam vulputate velit imperdiet dolor tempor tristique. Pellentesque habitant</p>
                        <ul>
                            <li>About Us</li>
                            <li>Services</li>
                            <li>Blog</li>
                            <li>Contact us</li>
                        </ul>
                        <ul>
                            <li>Support</li>
                            <li>Knowledge base</li>
                            <li>Live chat</li>
                        </ul>
                        <ul>
                            <li>Jobs</li>
                            <li>Our team</li>
                            <li>Leadership</li>
                            <li>Privacy Policy</li>
                        </ul>
                        <ul>
                            <li>Kruzo Aero</li>
                            <li>Ergonomic Chair</li>
                            <li>Nordic Chair</li>
                        </ul>
                    </div>
                    <hr className="hr" />
                    <div className="footer-bottom-sections2">
                        <p className="footer-bottom-sections2-para">Copyright ©2024. All Rights Reserved. — Designed with love by Untree.co Distributed By</p>
                        <div className="terms">
                            <p>Terms & Conditions</p>
                            <p>Privacy Policy</p>
                        </div>
                    </div>
                </div>


            </div>
        </div>
    )
}
export default Footer