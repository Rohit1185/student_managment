import { useState, useEffect, useContext } from "react";
import axios from "axios";
import moment from "moment";
import ContextLogin from "../Context/Login";
import "../assets/facultyDashboard.css"; // Importing CSS

const FacultyDashboard = () => {
    const user = useContext(ContextLogin);
    const [assignments, setAssignments] = useState([]);
    const [notes, setNotes] = useState([]);
    const [submissions, setSubmissions] = useState([]);

    // Fetch faculty data
    useEffect(() => {
        if (!user) return;
        const fetchFacultyData = async () => {
            try {
                const res = await axios.get(`http://localhost:8080/faculty/${user.user.user.id}`);
                console.log(res.data);
                setAssignments(res.data.assignments);
                setNotes(res.data.notes);
                setSubmissions(res.data.submissions);
            } catch (error) {
                console.error("Error fetching faculty data:", error);
            }
        };
        fetchFacultyData();
    }, [user]);

    return (
        <div className="faculty-dashboard">
            <h1>Faculty Dashboard</h1>

            {/* Assignments Section */}
            <div className="dashboard-section">
                <h2>📝 Assignments Uploaded</h2>
                <div className="table-container">
                    <table className="dashboard-table">
                        <thead>
                            <tr>
                                <th>Unit No</th>
                                <th>Unit Name</th>
                                <th>Course</th>
                                <th>Due Date</th>
                                <th>Uploaded On</th>
                                <th>Download</th>
                            </tr>
                        </thead>
                        <tbody>
                            {assignments.length > 0 ? (
                                assignments.map((assignment) => (
                                    <tr key={assignment._id}>
                                        <td>{assignment.unitNo}</td>
                                        <td>{assignment.unitName}</td>
                                        <td>{assignment.course}</td>
                                        <td>{moment(assignment.dueDate).format("DD-MM-YYYY")}</td>
                                        <td>{moment(assignment.createdAt).format("DD-MM-YYYY")}</td>
                                        <td>
                                            <a href={assignment.fileUrl} target="_blank" rel="noopener noreferrer" className="download-link">
                                                📥 Download
                                            </a>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6">No assignments uploaded.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Notes Section */}
            <div className="dashboard-section">
                <h2>📄 Notes Uploaded</h2>
                <div className="table-container">
                    <table className="dashboard-table">
                        <thead>
                            <tr>
                                <th>Unit Name</th>
                                <th>Course</th>
                                <th>Uploaded On</th>
                                <th>Download</th>
                            </tr>
                        </thead>
                        <tbody>
                            {notes.length > 0 ? (
                                notes.map((note) => (
                                    <tr key={note._id}>
                                        <td>{note.unitName}</td>
                                        <td>{note.course}</td>
                                        <td>{moment(note.uploadedAt).format("DD-MM-YYYY")}</td>
                                        <td>
                                            <a href={note.fileUrl} target="_blank" rel="noopener noreferrer" className="download-link">
                                                📥 Download
                                            </a>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4">No notes uploaded.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Assignment Submissions Section */}
            <div className="dashboard-section">
    <h2>📂 Assignment Submissions</h2>
    <div className="table-container">
        <table className="dashboard-table">
            <thead>
                <tr>
                    <th>Student Name</th>
                    <th>Enrollment No</th>
                    <th>Course</th>
                    <th>Unit No</th>
                    <th>Unit Name</th>
                    <th>Due Date</th>
                    <th>Submitted At</th>
                    <th>Download</th>
                </tr>
            </thead>
            <tbody>
                {submissions?.length > 0 ? (
                    submissions.map((submission) => (
                        <tr key={submission._id}>
                            <td>{submission.studentName}</td>
                            <td>{submission.enrollmentNo}</td>
                            <td>{Array.isArray(submission.course) ? submission.course.join(", ") : submission.course}</td>
                            <td>{submission.unitNo}</td>
                            <td>{submission.unitName}</td>
                            <td>{new Date(submission.dueDate).toLocaleDateString()}</td>
                            <td>{new Date(submission.submittedAt).toLocaleString()}</td>
                            <td>
                                <a href={submission.fileUrl} target="_blank" rel="noopener noreferrer" className="download-link">
                                    📥 Download
                                </a>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="8">No submissions received.</td>
                    </tr>
                )}
            </tbody>
        </table>
    </div>
</div>

        </div>
    );
};

export default FacultyDashboard;
