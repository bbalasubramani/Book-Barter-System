// src/components/Signup.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3030/api/auth/register', form);
      alert('Signup successful');
      navigate('/login');
    } catch (err) {
      alert(err?.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="signup-form">
      <h2 className="signup-title">Signup</h2>
      <input name="name" className="signup-input" placeholder="Name" onChange={handleChange} required />
      <input name="email" className="signup-input" placeholder="Email" type="email" onChange={handleChange} required />
      <input name="password" className="signup-input" placeholder="Password" type="password" onChange={handleChange} required />
      <button type="submit" className="signup-button">Register</button>
    </form>
  );
}

export default Signup;
