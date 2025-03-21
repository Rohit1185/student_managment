/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import moment from "moment";
import { FaDownload, FaFileAlt } from "react-icons/fa";
import "./StudentDashboard.css"; // Import the CSS file
import Login from "../Context/Login";

function Student_Dashboard() {
  const [notes, setNotes] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [selectedNoteCourse, setSelectedNoteCourse] = useState(""); // Filter for Notes
  const [selectedAssignmentCourse, setSelectedAssignmentCourse] = useState(""); // Filter for Assignments

  const userProfile = useContext(Login); // Get user data from context
  const userCourses = userProfile?.user?.additional_info?.courses || []; // Extract user courses safely

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (userCourses.length === 0) {
          console.warn("No courses found in user context.");
          return;
        }

        // ✅ Fetch notes and assignments filtered by user courses from API
        const [notesRes, assignmentsRes] = await Promise.all([
          axios.get("http://localhost:8080/student/latest-notes"),
          axios.get("http://localhost:8080/student/latest-assignments"),
        ]);

        console.log("API Notes Data:", notesRes.data);
        console.log("API Assignments Data:", assignmentsRes.data);

        // ✅ Filter notes and assignments based on user's courses
        const filteredNotes = notesRes.data.filter((note) =>
          userCourses.includes(note.course)
        );

        const filteredAssignments = assignmentsRes.data.filter((assignment) =>
          userCourses.includes(assignment.course)
        );

        setNotes(filteredNotes);
        setAssignments(filteredAssignments);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [userCourses]);

  // ✅ Filter Notes & Assignments based on Selected Course
  const filteredNotes = selectedNoteCourse
    ? notes.filter((note) => note.course === selectedNoteCourse)
    : notes;

  const filteredAssignments = selectedAssignmentCourse
    ? assignments.filter((assignment) => assignment.course === selectedAssignmentCourse)
    : assignments;

  return (
    <div className="container">
      <div className="header">🎓 Student Dashboard</div>

      {/* 🔹 Notes Section with Filter */}
      <div className="section">
        <h2>📚 Latest Notes</h2>

        {/* Filter Dropdown for Notes */}
        <select
          className="filterDropdown"
          value={selectedNoteCourse}
          onChange={(e) => setSelectedNoteCourse(e.target.value)}
        >
          <option value="">All Courses</option>
          {userCourses.map((course, index) => (
            <option key={index} value={course}>{course}</option>
          ))}
        </select>

        <div className="grid">
          {filteredNotes.length > 0 ? (
            filteredNotes.map((note, index) => (
              <div key={index} className="card">
                <h3 className="title">
                  <FaFileAlt /> Unit {note.unitName}
                </h3>
                <p><b>Uploaded By:</b> {note.facultyName}</p>
                <p><b>Course:</b> {note.course}</p>
                <p><b>Upload Date:</b> {moment(note.uploadedAt).format("DD-MM-YYYY")}</p>
                <a href={note.fileUrl} target="_blank" rel="noopener noreferrer" className="downloadBtn">
                  <FaDownload /> Download
                </a>
              </div>
            ))
          ) : (
            <p>No notes available</p>
          )}
        </div>
      </div>

      {/* 🔹 Assignments Section with Filter */}
      <div className="sectionAssignments">
        <h2>📝 Latest Assignments</h2>

        {/* Filter Dropdown for Assignments */}
        <select
          className="filterDropdown"
          value={selectedAssignmentCourse}
          onChange={(e) => setSelectedAssignmentCourse(e.target.value)}
        >
          <option value="">All Courses</option>
          {userCourses.map((course, index) => (
            <option key={index} value={course}>{course}</option>
          ))}
        </select>

        <div className="grid">
          {filteredAssignments.length > 0 ? (
            filteredAssignments.map((assignment, index) => (
              <div key={index} className="card">
                <h3 className="title">
                  <FaFileAlt /> Unit: {assignment.unitNo} {assignment.unitName}
                </h3>
                <p><b>Faculty:</b> {assignment.facultyName}</p>
                <p><b>Course:</b> {assignment.course}</p>
                <p><b>Upload Date:</b> {moment(assignment.uploadedAt).format("DD-MM-YYYY")}</p>
                <p><b>Due Date:</b> {moment(assignment.dueDate).format("DD-MM-YYYY")}</p>
                <a href={assignment.fileUrl} target="_blank" rel="noopener noreferrer" className="downloadBtn">
                  <FaDownload /> Download
                </a>
              </div>
            ))
          ) : (
            <p>No assignments available</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Student_Dashboard;
