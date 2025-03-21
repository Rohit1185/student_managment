import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import Login from "../Context/Login"; // Import the context
import "../assets/assignments.css"; // Import the updated CSS file

const AssignmentsPage = () => {
  const userData = useContext(Login);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [assignments, setAssignments] = useState([]);
  const [facultyNames, setFacultyNames] = useState({}); // Store faculty names


  // Extract courses from user context
  const courses = Array.isArray(userData?.user?.additional_info?.courses)
    ? userData?.user?.additional_info?.courses
    : userData?.user?.additional_info?.courses
    ? [userData?.user?.additional_info?.courses]
    : [];
  const userId = userData.user.id
  useEffect(() => {
    console.log("User Id",userId);
    if (selectedCourse) {
      axios
        .get(`http://localhost:8080/assignments?course=${selectedCourse}`)
        .then(async (response) => {
          console.log("Assignments Response:", response.data);
          setAssignments(response.data);

          // Fetch Faculty Names
          const facultyRequests = response.data.map((assignment) =>
            axios.get(`http://localhost:8080/user/${assignment.facultyId}`)
          );

          const facultyResponses = await Promise.all(facultyRequests);
          const facultyData = facultyResponses.reduce((acc, res) => {
            acc[res.data._id] = res.data.name; // Store faculty name
            return acc;
          }, {});

          setFacultyNames(facultyData);
        })
        .catch((error) => console.error("Error fetching assignments:", error));
    }
  }, [selectedCourse]);

  return (
    <div className="assignments-container">
      <h1 className="assignments-title">Student Assignments</h1>
      <label className="assignments-label">Select Course:</label>
      <select
        className="assignments-dropdown"
        value={selectedCourse}
        onChange={(e) => setSelectedCourse(e.target.value)}
      >
        <option value="">-- Select a Course --</option>
        {courses.length > 0 ? (
          courses.map((course, index) => (
            <option key={index} value={course}>
              {course}
            </option>
          ))
        ) : (
          <option disabled>No Courses Available</option>
        )}
      </select>

      <div className="assignments-content">
        <h2 className="assignments-subtitle">Available Assignments</h2>
        {assignments.length === 0 ? (
          <p className="assignments-empty">No assignments available for this course.</p>
        ) : (
          <div className="assignments-grid">
            {assignments.map((assignment) => (
              <div key={assignment.id} className="assignment-card">
                <h3 className="assignment-course">{assignment.course}</h3>
                <p className="assignment-detail"><strong>Unit No:</strong> {assignment.unitNo} {assignment.unitName}</p>
                <p className="assignment-detail"><strong>Uploaded By:</strong> {facultyNames[assignment.facultyId] || "Loading..."}</p>
                <p className="assignment-detail"><strong>Due Date:</strong> {new Date(assignment.dueDate).toLocaleDateString()}</p>
                <a href={assignment.fileUrl} download target="_blank" className="assignment-download">
                  Download Assignment
                </a>
                <a 
        href={`/submit-assignment?facultyId=${assignment.facultyId}&assignmentId=${assignment._id}&studentId=${userId}`} 
        target="_blank"  // ✅ Opens in the same tab
    >Submite here</a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignmentsPage;
