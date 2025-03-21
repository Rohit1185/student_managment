import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ContextLogin from "../Context/Login";
import "../assets/facultyProfile.css";

const FacultyProfile = () => {
    const { user } = useContext(ContextLogin);
    console.log(user.user.additional_info.courses)
    const [editMode, setEditMode] = useState(false);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        department: "",
        employeeID: "",
    });

    console.log("form data of faculty profile",formData)
    // Load user data
    useEffect(() => {
        if (user) {
            setFormData({
                name: user?.user?.name || "",
                email: user?.user?.email || "",
                department: user?.user?.additional_info?.courses.join(',') ,
                employeeID: user?.user?.additional_info?.employee_id || "",
            });
        }
    }, [user]);

    // Handle form input changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // ✅ Save updated faculty data
    const handleSave = async () => {
        try {
            const response = await axios.put(
                `http://localhost:8080/faculty/update/${user.user.id}`,
                {
                    name: formData.name,
                    department: formData.department,
                },
                { withCredentials: true }
            );

            console.log("Updated Faculty Data:", response.data);
            setEditMode(false);
        } catch (error) {
            console.error("Error updating faculty profile:", error);
        }
    };

    return (
        <div className="faculty-profile">
            <h2 className="faculty-title">Faculty Profile</h2>

            {/* Profile Information */}
            <div className="profile-info-container">
                <label className="profile-label">Name:</label>
                {editMode ? (
                    <input type="text" name="name" value={formData.name} onChange={handleChange} className="profile-input" />
                ) : (
                    <p className="profile-text">{formData.name}</p>
                )}

                <label className="profile-label">Email:</label>
                <p className="profile-text">{formData.email}</p>

                <label className="profile-label">Courses:</label>
{editMode ? (
    <input
        type="text"
        name="department"
        value={formData.department}
        onChange={handleChange}
        className="profile-input"
    />
) : (
    <ul className="profile-text">
        {Array.isArray(formData.department)
            ? formData.department.map((course, index) => <li key={index}>{course}</li>)
            : formData.department}
    </ul>
)}

                <label className="profile-label">Employee ID:</label>
                <p className="profile-text">{formData.employeeID}</p>
            </div>

            {/* Buttons */}
            <div className="profile-buttons">
                {editMode ? (
                    <button className="profile-button save-btn" onClick={handleSave}>Save</button>
                ) : (
                    <button className="profile-button edit-btn" onClick={() => setEditMode(true)}>Edit</button>
                )}
            </div>
            <button className="profile-button update-password-btn" onClick={() => navigate("/update-pass")}>
                Update Password
            </button>
        </div>
    );
};

export default FacultyProfile;
