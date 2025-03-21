import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import Login from "../Context/Login"; // Import the context
import "../assets/notes.css"; // Import the updated CSS file

const NotesPage = () => {
  const userData = useContext(Login);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [notes, setNotes] = useState([]);
  const [facultyNames, setFacultyNames] = useState({}); // Store faculty names

  console.log("User for Notes", userData);

  // Extract courses from user context
  const courses = Array.isArray(userData?.user?.additional_info?.courses)
    ? userData?.user?.additional_info?.courses
    : userData?.user?.additional_info?.courses
    ? [userData?.user?.additional_info?.courses]
    : [];

  useEffect(() => {
    if (selectedCourse) {
      axios
        .get(`http://localhost:8080/notes?course=${selectedCourse}`)
        .then(async (response) => {
          console.log("Notes Response:", response.data);
          setNotes(response.data);

          // Fetch Faculty Names
          const facultyRequests = response.data.map((note) =>
            axios.get(`http://localhost:8080/user/${note.facultyId}`)
          );

          const facultyResponses = await Promise.all(facultyRequests);
          const facultyData = facultyResponses.reduce((acc, res) => {
            acc[res.data._id] = res.data.name; // Store faculty name
            return acc;
          }, {});

          setFacultyNames(facultyData);
        })
        .catch((error) => console.error("Error fetching notes:", error));
    }
  }, [selectedCourse]);

  return (
    <div className="notes-container">
      <h1 className="notes-title">Student Notes</h1>
      <label className="notes-label">Select Course:</label>
      <select
        className="notes-dropdown"
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

      <div className="notes-content">
        <h2 className="notes-subtitle">Available Notes</h2>
        {notes.length === 0 ? (
          <p className="notes-empty">No notes available for this course.</p>
        ) : (
          <div className="notes-grid">
            {notes.map((note) => (
              <div key={note.id} className="notes-card">
                <h3 className="notes-course">{note.course}</h3>
                <p className="notes-unit"><strong>Unit:</strong> {note.unitName}</p>
                <p className="notes-faculty">
                  <strong>Uploaded By:</strong> {facultyNames[note.facultyId] || "Loading..."}
                </p>
                <p className="notes-date">
                  <strong>Upload Date:</strong> {new Date(note.uploadedAt).toLocaleDateString()}
                </p>
                <a href={note.fileUrl} download className="notes-download">
                  Download
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotesPage;
