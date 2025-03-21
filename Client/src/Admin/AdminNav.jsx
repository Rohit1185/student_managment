import { Link, useNavigate } from "react-router-dom";
import { GraduationCap ,LayoutDashboard, FileText, Users, LogOut } from "lucide-react";
import { useContext } from "react";
import userContext from "../Context/Login"; // ✅ Import user context
import "../assets/AdminSidebar.css"; // ✅ Updated CSS file
import logo from '../assets/pa-removebg-preview.png'
const AdminSidebar = () => {
  const { setIsLoggedIn, setUserRole } = useContext(userContext);
  const navigate = useNavigate();
  

  // ✅ Logout Function
  const logout = () => {
    setIsLoggedIn(false);
    setUserRole("");
    navigate("/login"); // Ensure this works inside BrowserRouter
  };

  return (
    <div className={`sidebar sidebar-expanded`}>
      {/* ✅ Sidebar Header */}
      <div className="sidebar-header">
        <Link to="/admin/dashboard" className="brand">
          <img src={logo} alt="" className="logo-img"/><br /><br />
          <span>Promise Academy </span>
        </Link>
      </div>

      {/* ✅ Navigation Links */}
      <nav className="sidebar-menu">
      
  <NavItem to="/admin/dashboard" icon={<LayoutDashboard />} text="Overview" />
  <NavItem to="/admin/inquiries" icon={<FileText />} text="Inquiries" />
  <NavItem to="/admin/users" icon={<Users />} text="Users" />
    <NavItem to="/admin/faculty" icon={<GraduationCap />} text="Faculty" />
  </nav>
      {/* ✅ Logout Button */}
      <div className="sidebar-footer">
        <NavItem to="#" icon={<LogOut />} text="Logout" isLogout onClick={logout} />
      </div>
    </div>
  );
};

// ✅ Reusable Navigation Item Component
const NavItem = ({ to, icon, text, onClick, isLogout }) => {
  return isLogout ? (
    <button className="menu-item logout-btn" onClick={onClick}>
      <span className="menu-icon">{icon}</span>
      <span className="menu-text">{text}</span>
    </button>
  ) : (
    <Link to={to} className="menu-item">
      <span className="menu-icon">{icon}</span>
      <span className="menu-text">{text}</span>
    </Link>
  );
};

export default AdminSidebar;
