const mongoose = require("mongoose");

const registerSchema = new mongoose.Schema({
  personalDetails: {
    name: String,
    mobileNo: String,
    fathersNo: String,
    address: String,
    email: String,
    dob: Date,
  },
  academicDetails: {
    stdYear: String,
    semester: String,
    schoolCollegeName: String,
  },
  courseInquired: String,
  reference: { type: [String], default: [] },
  status: String, // ✅ Status of admission (Admitted, Pending, etc.)
  courseAssigned: {
    courseName: { type: String, default: null }, // ✅ Course Name
    duration: { type: String, default: null }, // ✅ Course Duration
    faculty: { type: String, default: null }, // ✅ Faculty Name
    company: { type: String, default: null }, // ✅ Company Name
  },
  // ✅ New Fields for Login Credentials
  username: { type: String}, // Unique username for login
  password: { type: String }, // Hashed password for security
});

module.exports = mongoose.model("Register", registerSchema);
