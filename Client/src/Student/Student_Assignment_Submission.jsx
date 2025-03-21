import { useState } from "react";
import { useLocation } from "react-router-dom"; 
import axios from "axios";
import "../assets/studentSubmission.css";

const SubmitAssignment = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);

    // ✅ Extract assignmentId and facultyId from URL
    const assignmentId = queryParams.get("assignmentId") || "";
    const facultyId = queryParams.get("facultyId") || "";
    const studentId = queryParams.get("studentId") || "";

    const [formData, setFormData] = useState({
        studentName: "", // ✅ Student can enter their name
        enrollmentNo: "",
        course: "",
        unitNo: "",
        unitName: "",
        assignmentId,
        assignmentTitle: "",
        facultyId,
        studentId
    });

    const [file, setFile] = useState(null);
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
  
      if (!file) {
          setMessage("Please upload a file.");
          return;
      }
  
      // 🔍 Check formData before appending
      console.log("Form Data before sending:", formData);
  
      const formDataToSend = new FormData();
  
      // 🔍 Ensure all form fields have valid values
      Object.entries(formData).forEach(([key, value]) => {
          if (value !== "" && value !== undefined) {
              formDataToSend.append(key, value);
          }
      });
  
      // 🔍 Ensure file is not null
      if (file) {
          formDataToSend.append("file", file);
      } else {
          console.error("File is missing!");
      }
  
      // 🔍 Log FormData contents
      console.log("FormData Entries:");
      for (let pair of formDataToSend.entries()) {
          console.log(pair[0] + ": ", pair[1]); // File should show as a File object
      }
      setFormData({
        studentName: "",
        enrollmentNo: "",
        course: "",
        unitNo: "",
        unitName: "",
        assignmentId, // Keep assignmentId
        assignmentTitle: "",
        facultyId, // Keep facultyId
        studentId, // Keep studentId
    });
    setFile(null);

    // ✅ Clear file input manually
    document.querySelector("input[type='file']").value = "";
      
      try {
          const res = await axios.post("http://localhost:8080/submission/submit", formDataToSend, {
              headers: { "Content-Type": "multipart/form-data" }
          });
  
          setMessage(res.data.message);
      } catch (error) {
          setMessage("Error submitting assignment");
          console.error(error);
      }
  };
  
    return (
        <div className="submission-form">
            <h2>📂 Submit Assignment</h2>
            {message && <p className="message">{message}</p>}

            <form onSubmit={handleSubmit}>
                <input type="text" name="studentName" placeholder="Student Name" value={formData.studentName} onChange={handleChange} required /> 
                <input type="text" name="enrollmentNo" placeholder="Enrollment Number" value={formData.enrollmentNo} onChange={handleChange} required />
                <input type="text" name="course" placeholder="Course" value={formData.course} onChange={handleChange} required />
                <input type="number" name="unitNo" placeholder="Unit Number" value={formData.unitNo} onChange={handleChange} required />
                <input type="text" name="unitName" placeholder="Unit Name" value={formData.unitName} onChange={handleChange} required />
                <input type="text" name="assignmentTitle" placeholder="Assignment Title" value={formData.assignmentTitle} onChange={handleChange} required />

                <input type="file" onChange={handleFileChange} required />

                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default SubmitAssignment;
