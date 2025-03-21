import { useState, useEffect, useContext } from "react";
import axios from "axios";
import ContextLogin from "../Context/Login";
import "../assets/facultyAssignments.css";

const FacultyAssignmentUpload = () => {
    const { user } = useContext(ContextLogin);
    const [selectedCourse, setSelectedCourse] = useState("");
    const [file, setFile] = useState(null);
    const [dueDate, setDueDate] = useState("");
    const [submissionLink, setSubmissionLink] = useState("");
    const [unitNo, setUnitNo] = useState(""); // ✅ New state for Unit No.
    const [unitName, setUnitName] = useState(""); // ✅ New state for Unit Name
    const [assignments, setAssignments] = useState([]);

    useEffect(() => {
        if (!user?.user?.id) return;
        const fetchAssignments = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/assignments/${user.user.id}`);
                console.log("Assignment Fetch", response.data);
                setAssignments(response.data);
            } catch (error) {
                console.error("Error fetching assignments:", error);
            }
        };
        fetchAssignments();
    }, [user]);

    const handleUpload = async () => {
        if (!file || !selectedCourse || !dueDate || !submissionLink || !unitNo || !unitName) {
            alert("All fields are required.");
            return;
        }
    
        const formData = new FormData();
        formData.append("file", file);
        formData.append("facultyId", user.user.id);
        formData.append("course", selectedCourse);
        formData.append("unitNo", unitNo);
        formData.append("unitName", unitName);
        formData.append("dueDate", dueDate);
        formData.append("submissionLink", submissionLink);
    
        try {
            const response = await axios.post("http://localhost:8080/assignments/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
    
            alert("Assignment uploaded successfully!");
            setAssignments([...assignments, response.data.assignment]);
    
            // ✅ Clear all input fields after successful submission
            setFile(null);
            setSelectedCourse("");
            setUnitNo("");
            setUnitName("");
            setDueDate("");
            setSubmissionLink("");
        } catch (error) {
            console.error("Error uploading assignment:", error);
            alert("Upload failed.");
        }
    };
    

    const handleDelete = async (assignmentId) => {
        try {
            await axios.delete(`http://localhost:8080/assignments/${assignmentId}`);
            setAssignments(assignments.filter((assignment) => assignment._id !== assignmentId));
        } catch (error) {
            console.error("Error deleting assignment:", error);
        }
    };

    const departmentList = Array.isArray(user?.user?.additional_info?.courses)
        ? user.user.additional_info.courses
        : user?.user?.additional_info?.courses
        ? [user.user.additional_info.courses]
        : [];

    return (
        <div className="faculty-assignment-upload">
            <h2>Upload Assignments</h2>

            <div className="course-selection">
                <label>Select Course:</label>
                <select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)}>
                    <option value="">--Select Course--</option>
                    {departmentList.map((course, index) => (
                        <option key={index} value={course}>{course}</option>
                    ))}
                </select>
            </div>

            {/* ✅ Unit No. and Unit Name Fields */}
            <div className="unit-section">
                <label>Unit No.:</label>
                <input type="number" value={unitNo} onChange={(e) => setUnitNo(e.target.value)} placeholder="Enter Unit No." />
                
                <label>Unit Name:</label>
                <input type="text" value={unitName} onChange={(e) => setUnitName(e.target.value)} placeholder="Enter Unit Name" />
            </div>

            <div className="upload-section">
                <input type="file" onChange={(e) => setFile(e.target.files[0])} />
                <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
                <input type="text" placeholder="Submission Link" value={submissionLink} onChange={(e) => setSubmissionLink(e.target.value)} />
                <button onClick={handleUpload}>Upload</button>
            </div>

            <h3>Uploaded Assignments</h3>
            {assignments.length > 0 ? (
                <table className="assignments-table">
                    <thead>
                        <tr>
                            <th>Course</th>
                            <th>Unit No.</th> {/* ✅ New column for Unit No. */}
                            <th>Unit Name</th> {/* ✅ New column for Unit Name */}
                            <th>File</th>
                            <th>Due Date</th>
                            <th>Submission Link</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {assignments.map((assignment) => (
                            <tr key={assignment._id}>
                                <td>{assignment.course}</td>
                                <td>{assignment.unitNo || "N/A"}</td> {/* ✅ Display Unit No. */}
                                <td>{assignment.unitName || "N/A"}</td> {/* ✅ Display Unit Name */}
                                <td>
                                    <a href={`http://localhost:8080${assignment.fileUrl}`} target="_blank" rel="noopener noreferrer">View File</a>
                                </td>
                                <td>{new Date(assignment.dueDate).toLocaleDateString()}</td>
                                <td>
                                    <a href={assignment.submissionLink} target="_blank" rel="noopener noreferrer">Submit Here</a>
                                </td>
                                <td>
                                    <button onClick={() => handleDelete(assignment._id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No assignments uploaded yet.</p>
            )}
        </div>
    );
};

export default FacultyAssignmentUpload;
