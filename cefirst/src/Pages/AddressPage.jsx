import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddressPage.css";

function AddressPage() {
  const { setAddress } = location.state || {};
  const [address, setAddressState] = useState({
    fullName: "",
    mobileNumber: "",
    pinCode: "",
    flat: "",
    area: "",
    landmark: "",
    city: "",
    state: "",
    isDefault: false,
    deliveryInstructions: "",
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAddressState({ ...address, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("userAddress", JSON.stringify(address));
    alert("Address saved successfully!");
    navigate("/cart");
  };

  return (
    <div className="address-container">
      <h2>Enter Delivery Address</h2>
      <form onSubmit={handleSubmit} className="address-form">
        <div className="address-field">
          <label>Full Name</label>
          <input
            type="text"
            name="fullName"
            value={address.fullName}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="address-field">
          <label>Mobile Number</label>
          <input
            type="text"
            name="mobileNumber"
            value={address.mobileNumber}
            onChange={handleInputChange}
            pattern="\d{10}"
            title="Mobile number must be 10 digits"
            required
          />
        </div>
        <div className="address-field">
          <label>Pincode</label>
          <input
            type="text"
            name="pinCode"
            value={address.pinCode}
            onChange={handleInputChange}
            pattern="\d{6}"
            title="Pincode must be 6 digits"
            required
          />
        </div>
        <div className="address-field">
          <label>Flat, Building, Apartment</label>
          <input
            type="text"
            name="flat"
            value={address.flat}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="address-field">
          <label>Area, Street, Sector</label>
          <input
            type="text"
            name="area"
            value={address.area}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="address-field">
          <label>City</label>
          <input
            type="text"
            name="city"
            value={address.city}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="address-field">
          <label>State</label>
          <select
    name="state"
    value={address.state}
    onChange={handleInputChange}
    required
  >
    <option value="">Select State</option>
    <option value="Andhra Pradesh">Andhra Pradesh</option>
    <option value="Arunachal Pradesh">Arunachal Pradesh</option>
    <option value="Assam">Assam</option>
    <option value="Bihar">Bihar</option>
    <option value="Chhattisgarh">Chhattisgarh</option>
    <option value="Goa">Goa</option>
    <option value="Gujarat">Gujarat</option>
    <option value="Haryana">Haryana</option>
    <option value="Himachal Pradesh">Himachal Pradesh</option>
    <option value="Jharkhand">Jharkhand</option>
    <option value="Karnataka">Karnataka</option>
    <option value="Kerala">Kerala</option>
    <option value="Madhya Pradesh">Madhya Pradesh</option>
    <option value="Maharashtra">Maharashtra</option>
    <option value="Manipur">Manipur</option>
  <option value="Meghalaya">Meghalaya</option>
  <option value="Mizoram">Mizoram</option>
  <option value="Nagaland">Nagaland</option>
  <option value="Odisha">Odisha</option>
  <option value="Punjab">Punjab</option>
  <option value="Rajasthan">Rajasthan</option>
  <option value="Sikkim">Sikkim</option>
  <option value="Tamil Nadu">Tamil Nadu</option>
  <option value="Telangana">Telangana</option>
  <option value="Tripura">Tripura</option>
  <option value="Uttar Pradesh">Uttar Pradesh</option>
  <option value="Uttarakhand">Uttarakhand</option>
  <option value="West Bengal">West Bengal</option>
  <option value="Chandigarh">Chandigarh</option>
  <option value="Lakshadweep">Lakshadweep</option>
  <option value="Delhi">Delhi</option>
  <option value="Puducherry">Puducherry</option>
  <option value="Ladakh">Ladakh</option>
  <option value="Jammu and Kashmir">Jammu and Kashmir</option>
</select>

        </div>
        <div className="address-field">
          <button type="submit" className="submit-btn">
            Save Address
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddressPage;
