import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Login from "../Context/Login"; // Import user context
import "../assets/profile.css"; // Import CSS file

const ProfilePage = () => {
  const userData = useContext(Login);
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: userData?.user?.name || "",
    courses: Array.isArray(userData?.user?.additional_info?.courses)
      ? userData.user.additional_info.courses
      : userData?.user?.additional_info?.courses
      ? [userData.user.additional_info.courses]
      : [],
  });

  if (!userData || !userData.user) {
    return <p className="error-message">User data not available.</p>;
  }

  const { email, role, additional_info } = userData.user;
  const courses = userData.user.additional_info.courses;
  const enrollment_number = additional_info?.enrollment_number;

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle save functionality (Mock)
  const handleSave = () => {
    console.log("Updated Profile:", formData);
    setEditMode(false);
  };

  return (
    <div className="profile-container">
      <h1 className="profile-title">User Profile</h1>
      <div className="profile-card">
        <div className="profile-header">
          <h2 className="profile-name">
            {editMode ? (
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="profile-input"
              />
            ) : (
              formData.name
            )}
          </h2>
          <p className="profile-role">{role}</p>
        </div>
        <div className="profile-details">
          <p><strong>Email:</strong> {email}</p>
          <p><strong>Role:</strong> {role}</p>
          <p><strong>Enrollment:</strong> {enrollment_number}</p>
          <p>
            <strong>Courses:</strong>{courses+" "}
          </p>
        </div>
        <div className="profile-buttons">
          {editMode ? (
            <button className="profile-button save-btn" onClick={handleSave}>
              Save
            </button>
          ) : (
            <button
              className="profile-button edit-btn"
              onClick={() => setEditMode(true)}
            >
              Edit Profile
            </button>
          )}
          <button
            className="profile-button update-password-btn"
            onClick={() => navigate("/update-pass")}
          >
            Update Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
