import { useState, useContext } from "react";
import axios from "axios";
import '../assets/forgotpass.css'
import ContextLogin from "../Context/Login"; // Import user context

const UpdatePassword = () => {
    const { user } = useContext(ContextLogin);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");

    const handleUpdatePassword = async () => {
        if (!currentPassword || !newPassword) {
            alert("Please fill in all fields.");
            return;
        }

        try {
            const response = await axios.put("http://localhost:8080/auth/update-password", {
                userId: user.id, // Get user ID from context
                currentPassword,
                newPassword,
            });

            alert(response.data.message);
            setCurrentPassword("");
            setNewPassword("");
        } catch (error) {
            console.error("Error updating password:", error);
            alert(error.response?.data?.error || "Failed to update password.");
        }
    };

    return (
        <div className="update-password">
            <h2>Update Password</h2>
            <input
                type="password"
                placeholder="Current Password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
            />
            <button onClick={handleUpdatePassword} className="update-pas">Update Password</button>
        </div>
    );
};

export default UpdatePassword;
