import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate,NavLink } from "react-router-dom";
import '../assets/login.css'
import userContext from "../Context/Login";

const Login = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const { setIsLoggedIn, setUserRole,setUser } = useContext(userContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("http://localhost:8080/student-faculty/login", formData);
      console.log("Response Data:", response.data);

      const { role } = response.data.user;

      setIsLoggedIn(true);
      setUserRole(role);

      if (role === "Admin") {
        navigate("/admin/inquiries"); 
      } 
      else if(role === "faculty"){
        navigate("/faculty-dashboard");
        setUser(response.data)
      }
      else {
        navigate("/student-dashboard");
        setUser(response.data.user); 
      }
    } catch (error) {
      console.log("Login Error:", error);

      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Invalid username or password");
      }
    }
  };

  return (
    
    <div className="container">
      <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          name="username" 
          value={formData.username}
          placeholder="Username" 
          onChange={handleChange} 
          required 
        />
        <input 
          type="password" 
          name="password" 
          value={formData.password}
          placeholder="Password" 
          onChange={handleChange} 
          required 
        />
        <NavLink to='forgot-password'  className="auth-link">Forgot password?</NavLink>
        {error && <p className="error">{error}</p>}
        <button type="submit">Login</button>
        <p>don't have account <NavLink to='/register'  className="auth-link">register here</NavLink></p>

      </form>
    </div>
    </div>
  );
};

export default Login;
