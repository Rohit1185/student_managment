import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import ContextLogin from "../Context/Login"; 
import '../assets/nav.css';
import logo from '../assets/pa-removebg-preview.png'
const Navbar = () => {
    const { isLoggedIn, setIsLoggedIn, userRole, setUserRole } = useContext(ContextLogin);
    const navigate = useNavigate();

    // 🔥 Logout Function
    const handleLogout = () => {
        setIsLoggedIn(false);
        setUserRole("");
        navigate("/login"); // Redirect to login page
    };

    return (
        <nav className="navbar">
            <div className="logo-info">
            <img src={logo} alt="" className="log-img"/>
            <h1>Promise Academy</h1>
            </div>
            <ul className="nav-links">
                {!isLoggedIn ? (
                    // ✅ Show Public Navbar when not logged in
                    <>
                        <li><Link to="/login">Login</Link></li>
                        <li><Link to="/register">Register</Link></li>
                    </>
                ) : userRole === "student" ? (
                    // ✅ Show Student Navbar
                    <>
                        <li className="student-link"><Link to="/student-dashboard">Dashboard</Link></li>
                        <li className="student-link"><Link to="/notes">Notes</Link></li>
                        <li className="student-link"><Link to="/assignments">Assignments</Link></li>
                        <li className="student-link"><Link to="/profile">Profile</Link></li>
                        <li className="student-link"><button className="logout-btn" onClick={handleLogout}>Logout</button></li>
                    </>
                ) : userRole === "faculty" ? (
                    // ✅ Show Faculty Navbar
                    <>
                        <li className="student-link"><Link to="/faculty-dashboard">Dashboard</Link></li>
                        <li className="student-link"><Link to="/manage-courses">Manage Courses</Link></li>
                        <li className="student-link"><Link to='/upload-assigments'>Upload Asignment</Link></li>
                        <li className="student-link"><Link to="/students">Students</Link></li>
                        <li className="student-link"><Link to="/profile">Profile</Link></li>
                        <li className="student-link"><button className="logout-btn" onClick={handleLogout}>Logout</button></li>
                    </>
                ) : null}
            </ul>
        </nav>
    );
};

export default Navbar;
