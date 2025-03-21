import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import "../assets/InquiryForm.css"; // Import CSS file

// ✅ Validation Schema
const schema = yup.object().shape({
  personalDetails: yup.object().shape({
    name: yup.string().required("Name is required"),
    mobileNo: yup.string().matches(/^[0-9]{10}$/, "Mobile number must be 10 digits").required("Mobile number is required"),
    fathersNo: yup.string().matches(/^[0-9]{10}$/, "Father's number must be 10 digits").required("Father's number is required"),
    address: yup.string().required("Address is required"),
    dob: yup.date().required("Date of Birth is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
  }),
  academicDetails: yup.object().shape({
    stdYear: yup.string().required("Year of study is required"),
    semester: yup.string().required("Semester is required"),
    schoolCollegeName: yup.string().required("School/College Name is required"),
  }),
  courseInquired: yup.string().optional(),
  reference: yup.array().min(1, "Select at least one reference"),
});

const InquiryForm = () => {
  const [loading, setLoading] = useState(false); // ✅ Loading state

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  // ✅ Submit Form
  const onSubmit = async (data) => {
    setLoading(true); // ✅ Set loading to true before request
    try {
      const response = await axios.post("http://localhost:8080/submit", data);
      alert("Inquiry submitted successfully!");
      console.log(response.data);
      reset(); // ✅ Reset form after successful submission
    } catch (error) {
      alert("Failed to submit inquiry");
      console.error(error);
    } finally {
      setLoading(false); // ✅ Set loading back to false
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Inquiry Form</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="form">
        
        {/* ✅ Personal Details */}
        <fieldset className="fieldset">
          <legend>Personal Details</legend>
          <div className="grid">
            <div className="info">
              <input {...register("personalDetails.name")} placeholder="Full Name" className="input" />
              <p className="error">{errors.personalDetails?.name?.message}</p>
            </div>
            <div className="info">
              <input {...register("personalDetails.mobileNo")} placeholder="Mobile No" className="input" />
              <p className="error">{errors.personalDetails?.mobileNo?.message}</p>
            </div>
            <div className="info">
              <input {...register("personalDetails.fathersNo")} placeholder="Father's Mobile No" className="input" />
              <p className="error">{errors.personalDetails?.fathersNo?.message}</p>
            </div>
            <div className="info">
              <input {...register("personalDetails.address")} placeholder="Address" className="input" />
              <p className="error">{errors.personalDetails?.address?.message}</p>
            </div>
            <div className="info">
              <input type="date" {...register("personalDetails.dob")} className="input" />
              <p className="error">{errors.personalDetails?.dob?.message}</p>
            </div>
            <div className="info">
              <input type="email" {...register("personalDetails.email")} placeholder="Email" className="input" />
              <p className="error">{errors.personalDetails?.email?.message}</p>
            </div>
          </div>
        </fieldset>

        {/* ✅ Academic Details */}
        <fieldset className="fieldset">
          <legend>Academic Details</legend>
          <div className="grid">
            <div className="info">
              <input {...register("academicDetails.stdYear")} placeholder="Year of Study" className="input" />
              <p className="error">{errors.academicDetails?.stdYear?.message}</p>
            </div>
            <div className="info">
              <input {...register("academicDetails.semester")} placeholder="Semester" className="input" />
              <p className="error">{errors.academicDetails?.semester?.message}</p>
            </div>
            <div className="full-width">
              <input {...register("academicDetails.schoolCollegeName")} placeholder="School/College Name" className="input" />
              <p className="error">{errors.academicDetails?.schoolCollegeName?.message}</p>
            </div>
          </div>
        </fieldset>

        {/* ✅ Optional Fields */}
        <fieldset className="fieldset">
          <legend>Additional Information</legend>
          <div>
            <input {...register("courseInquired")} placeholder="Course Inquired (Optional)" className="input" />
          </div>
          <div className="mt-3">
            <label className="label">How did you hear about us?</label>
            <div className="grid">
              {["Friends", "Social Media", "Website", "Email", "Other"].map((option) => (
                <label key={option} className="checkbox-container">
                  <input type="checkbox" value={option} {...register("reference")} />
                  <span>{option}</span>
                </label>
              ))}
            </div>
            <p className="error">{errors.reference?.message}</p>
          </div>
        </fieldset>

        {/* ✅ Submit Button with Loader */}
        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Submitting..." : "Submit Inquiry"}
        </button>
      </form>
    </div>
  );
};

export default InquiryForm;
