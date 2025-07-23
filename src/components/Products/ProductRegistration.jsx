import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import apiClient from '../apiClient';
import '../../styles/registeredTables.css';

const ProductRegistration = ({ onClose, onRegistrationSuccess }) => {
  const [formData, setFormData] = useState({ productDescription: '', price: '', unit: '', category: '' });
  const [error, setError] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await apiClient.get('/category/all');
        setCategories(data);
      } catch (err) {
        console.error("Error fetching categories", err);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.productDescription.trim() ||
      !formData.price ||
      !formData.unit.trim() ||
      !formData.category.trim()
    ) {
      setError("All fields are required.");
      Swal.fire({ icon: 'error', title: 'Validation Error', text: "All fields are required." });
      return;
    }
    setError('');
    try {
      const response = await apiClient.post('/product', formData, {
        headers: { 'Content-Type': 'application/json' }
      });
      const responseText = response.data;
      Swal.fire({ icon: 'success', title: 'Success', text: responseText });
      setFormData({ productDescription: '', price: '', unit: '', category: '' });
      onClose();
      if (onRegistrationSuccess) onRegistrationSuccess();
    } catch (err) {
      Swal.fire({ 
        icon: 'error', 
        title: 'Error', 
        text: err.response?.data || "An error occurred while registering the product. Please try again." 
      });
    }
  };

  return (
    <div className="rm-container">
      <div className="rm-header">
        <img 
          src="https://images.pexels.com/photos/3184311/pexels-photo-3184311.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
          alt="Products" 
          className="rm-header-image" 
        />
        <div className="rm-header-overlay">
          <h2>Product Registration</h2>
        </div>
      </div>
      <form className="rm-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="productDescription">Product Description</label>
            <input 
              type="text" 
              id="productDescription" 
              placeholder="Enter product description" 
              value={formData.productDescription} 
              onChange={handleChange} 
              required 
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="price">Price</label>
            <input 
              type="number" 
              id="price" 
              placeholder="Enter price" 
              value={formData.price} 
              onChange={handleChange} 
              required 
            />
          </div>
          <div className="form-group">
            <label htmlFor="unit">Unit</label>
            <input 
              type="text" 
              id="unit" 
              placeholder="Enter unit" 
              value={formData.unit} 
              onChange={handleChange} 
              required 
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select 
              id="category" 
              value={formData.category} 
              onChange={handleChange} 
              required
            >
              <option value="">Select category</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.category}>{cat.category}</option>
              ))}
            </select>
          </div>
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit" className="submit-btn">Register Product</button>
      </form>
    </div>
  );
};

export default ProductRegistration;
