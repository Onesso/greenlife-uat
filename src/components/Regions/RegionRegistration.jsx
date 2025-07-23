import React, { useState } from 'react';
import swal from 'sweetalert';
import { FaClipboardList, FaMapMarkerAlt } from 'react-icons/fa';
import apiClient from '../apiClient';
import '../../styles/registeredTables.css';

const RegionsRegistration = ({ onClose, onRegistrationSuccess }) => {
  const [formData, setFormData] = useState({ regionName: "", regionCode: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.regionName.trim() || !formData.regionCode.trim()) {
      setError("All fields are required.");
      swal({ title: "Validation Error", text: "All fields are required.", icon: "error", button: "OK" });
      return;
    }
    setError("");
    const payload = { regionName: formData.regionName, regionCode: formData.regionCode };
    try {
      const response = await apiClient.post('/region', payload, {
        headers: { "Content-Type": "application/json" }
      });
      const responseText = response.data;
      swal({ icon: "success", title: "Success", text: responseText, confirmButtonColor: "#2B9843" }).then(() => {
        setFormData({ regionName: "", regionCode: "" });
        onClose();
        if (onRegistrationSuccess) onRegistrationSuccess();
      });
    } catch (err) {
      swal({ icon: "error", title: "Error", text: err.response?.data || "An error occurred while registering. Please try again." });
    }
  };

  return (
    <div className="rm-container">
      <div className="rm-header">
        <img 
          src="https://images.pexels.com/photos/8943323/pexels-photo-8943323.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
          alt="Region Registration"
          className="rm-header-image" 
        />
        <div className="rm-header-overlay">
          <h2>Region Registration</h2>
        </div>
      </div>
      <form className="rm-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="regionName">
              <FaClipboardList className="icon" /> Region Name
            </label>
            <input 
              type="text" 
              id="regionName" 
              placeholder="Enter region name" 
              value={formData.regionName} 
              onChange={handleChange} 
              required 
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="regionCode">
              <FaMapMarkerAlt className="icon" /> Region Code
            </label>
            <input 
              type="text" 
              id="regionCode" 
              placeholder="Enter region code" 
              value={formData.regionCode} 
              onChange={handleChange} 
              required 
            />
          </div>
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit" className="submit-btn">Register Region</button>
      </form>
    </div>
  );
};

export default RegionsRegistration;
