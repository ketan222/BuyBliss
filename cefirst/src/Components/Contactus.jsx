import { useState } from 'react';
import './Contactus.css'
import { toast } from 'react-toastify';
import axios from 'axios';
function Contactus(){
    const [data,setData] = useState({fname:"",lname:"",email:"",message:""});
    async function submitHandler(event){
        event.preventDefault();
        const { fname, lname, email, message } = data;
        if (!fname || !lname || !email || !message) {            
            toast.error("All fields are required!");
            return;
        }
        try {
            const response = await axios.post('http://localhost:5000/api/v1/contact', {
                fname,
                lname,
                email,
                message: message,
            });
            toast.success(response.data.message || "Message sent successfully!");
            setData({ fname: "", lname: "", email: "", message: "" }); 
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to send the message.";
            toast.error(errorMessage);
        } 
    }
    function changeHandler(event) {
        const { name, value } = event.target;
        setData(prevData => ({
            ...prevData,
            [name]: value
        }));
    }
    return(
        <form onSubmit={submitHandler} className='form-contact'>
            <div className="label-form-contact">
                <div className="first-name-div div-two-in-one">
                    <label htmlFor="" className='label-contact'>First name</label>
                    <input type="text" className='name-input' name="fname" value={data.fname} onChange={changeHandler}/>
                </div>
                <div className="first-name-div div-two-in-one">
                    <label htmlFor="" className='label-contact'>Last name</label>
                    <input type="text"  className='name-input' name="lname" value={data.lname} onChange={changeHandler}/>
                </div>
            </div>
            <div className="first-name-div div-two-in-one">
                <label htmlFor="" className='email-label label-contact'>Email</label>
                <input type="email" className='big-input'name="email" value={data.email} onChange={changeHandler} />
            </div>
            <div className="first-name-div div-two-in-one">
                <label htmlFor="" className='label-textarea label-contact'>Message</label>
                <textarea className='big-input-textarea' name="message" value={data.message} onChange={changeHandler}></textarea>
            </div>
            <button className='submit-contact'>Send Message</button>
        </form>
    )
}
export default Contactus;