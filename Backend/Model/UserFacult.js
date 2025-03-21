const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Email validation
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
        },
        role: {
            type: String,
            enum: ["student", "faculty"],
            required: true,
        },
        additional_info: {
            enrollment_number: {
                type: String,
                trim: true,
                required: function () {
                    return this.role === "student";
                },
            },
            employee_id: {
                type: String,
                trim: true,
                unique: function () {
                    return this.role === "faculty";
                }, // Ensure unique faculty IDs
                required: function () {
                    return this.role === "faculty";
                },
            },
            
            courses: {
                type: [String], // Array to store multiple course names
                required: true, // Ensure at least one course is selected
                validate: {
                    validator: function (courses) {
                        return courses.length > 0; // Ensures at least one course is added
                    },
                    message: "At least one course must be selected.",
                },
            },
        },
        resetPasswordToken: { type: String }, 
        resetPasswordExpires: { type: Date }, 
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
