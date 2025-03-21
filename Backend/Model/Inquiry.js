const mongoose = require("mongoose");

const inquirySchema = new mongoose.Schema({
  personalDetails: {
    name: { type: String, required: true },
    mobileNo: { type: String, required: true },
    fathersNo: { type: String, required: true },
    address: { type: String, required: true },
    dob: { type: Date, required: true },
    email: { type: String, required: true },
  },
  academicDetails: {
    stdYear: { type: String, required: true }, // School/College year
    semester: { type: String, required: true },
    schoolCollegeName: { type: String, required: true },
  },
  courseInquired: { type: String }, // Optional
  reference: { type: [String], default: [] },
  admitted:Boolean
});

module.exports = mongoose.model("Inquiry", inquirySchema);
