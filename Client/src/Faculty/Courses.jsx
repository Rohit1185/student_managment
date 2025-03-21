import { useState, useEffect, useContext } from "react";
import ContextLogin from "../Context/Login"; // Import login context
import axios from "axios";
import "../assets/facultyCourse.css"; // Import CSS

const FacultyCourseManagement = () => {
    const { user } = useContext(ContextLogin); // Get faculty user data from context
    const [selectedCourse, setSelectedCourse] = useState("");
    const [unitName, setUnitName] = useState(""); // ✅ New state for Unit Name
    const [file, setFile] = useState(null);
    const [notes, setNotes] = useState([]);
    const courses = Array.isArray(user?.user?.additional_info?.courses)
        ? user?.user?.additional_info?.courses
        : [user?.user?.additional_info?.courses];

    console.log("Faculty Courses:", courses);

    useEffect(() => {
        if (!user?.user?.id) return; // Prevent API call if user is undefined

        const fetchNotes = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/faculty/notes/${user.user.id}`);
                console.log("Notes",response.data)
                setNotes(response.data);
            } catch (error) {
                console.error("Error fetching notes:", error);
            }
        };

        fetchNotes();
    }, [user]);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file || !selectedCourse || !unitName) {
            alert("Please select a course, enter unit name, and upload a file.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("facultyId", user.user.id);
        formData.append("course", selectedCourse);
        formData.append("unitName", unitName); // ✅ Adding Unit Name

        console.log("Form Data Before Upload:");
        for (let pair of formData.entries()) {
            console.log(pair[0] + ": " + pair[1]); // ✅ Logs form data correctly
        }

        try {
            const response = await axios.post("http://localhost:8080/faculty/uploadNotes", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            alert("File uploaded successfully!");

            // ✅ Corrected state update
            setNotes([...notes, response.data.note]); 
            setFile(null);
            setUnitName(""); // ✅ Clear input after upload
        } catch (error) {
            console.error("Error uploading file:", error);
            alert("Upload failed.");
        }
    };

    const handleDelete = async (noteId) => {
        try {
            await axios.delete(`http://localhost:8080/faculty/deleteNote/${noteId}`);
            setNotes(notes.filter((note) => note._id !== noteId));
        } catch (error) {
            console.error("Error deleting note:", error);
        }
    };

    return (
        <div className="faculty-course-management">
            <h2>Manage Courses & Upload Notes</h2>

            <div className="course-selection">
                <label>Select Course:</label>
                <select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)}>
                    <option value="">--Select Course--</option>
                    {courses.map((course, index) => (
                        <option key={index} value={course}>{course}</option>
                    ))}
                </select>
            </div>

            <div className="unit-selection">
                <label>Unit Name:</label> 
                <input 
                    type="text" 
                    value={unitName} 
                    onChange={(e) => setUnitName(e.target.value)} 
                    placeholder="Enter Unit Name" 
                />
            </div>

            <div className="upload-section">
                <input type="file" onChange={handleFileChange} />
                <button onClick={handleUpload}>Upload Notes</button>
            </div>

            <h3>Uploaded Notes</h3>
            {notes.length > 0 ? (
                <table className="notes-table">
                    <thead>
                        <tr>
                            <th>Course</th>
                            <th>Unit Name</th>
                            <th>File</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {notes.map((note) => (
                            <tr key={note._id}>
                                <td>{note.course}</td>
                                <td>{note.unitName || "N/A"}</td> {/* ✅ Display Unit Name */}
                                <td>
                                    <a href={note?.fileUrl || "#"} target="_blank" rel="noopener noreferrer">View File</a>
                                </td>
                                <td>
                                    <button onClick={() => handleDelete(note._id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No notes uploaded yet.</p>
            )}
        </div>
    );
};

export default FacultyCourseManagement;
