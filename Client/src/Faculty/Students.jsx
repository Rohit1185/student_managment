import { useState, useEffect, useContext } from "react";
import ContextLogin from "../Context/Login"; // Import login context
import axios from "axios";
import "../assets/facultyStudents.css"; // Import CSS

const FacultyStudents = () => {
    const { user } = useContext(ContextLogin); // Get faculty user data from context
    const [students, setStudents] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const studentsPerPage = 15;

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/faculty/students/${user.user.id}`);
                console.log("Students Regarding Faculty Curse",response.data)
                setStudents(response.data);
            } catch (error) {
                console.error("Error fetching students:", error);
            }
        };

        if (user) {
            fetchStudents();
        }
    }, [user]);

    // Filter students by name OR enrollment number
    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.additional_info.enrollment_number.includes(searchTerm)
    );

    // Pagination logic
    const indexOfLastStudent = currentPage * studentsPerPage;
    const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
    const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);

    // Handle pagination
    const nextPage = () => {
        if (indexOfLastStudent < filteredStudents.length) {
            setCurrentPage(prevPage => prevPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prevPage => prevPage - 1);
        }
    };

    return (
        <div className="faculty-students">
            <h2>Students in Your Course</h2>

            <input
                type="text"
                placeholder="Search by Name or Enrollment No..."
                className="search-bar"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />

            {currentStudents.length > 0 ? (
                <div className="table-container">
                    <table className="students-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Course</th>
                                <th>Enrollment No</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentStudents.map((student) => (
                                <tr key={student._id}>
                                    <td>{student.name}</td>
                                    <td>{student.email}</td>
                                    <td>{student.additional_info.courses+" "}</td>
                                    <td>{student.additional_info.enrollment_number}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    
                    {/* Pagination Controls */}
                    <div className="pagination">
                        <button onClick={prevPage} disabled={currentPage === 1}>Previous</button>
                        <span>Page {currentPage} of {Math.ceil(filteredStudents.length / studentsPerPage)}</span>
                        <button onClick={nextPage} disabled={indexOfLastStudent >= filteredStudents.length}>Next</button>
                    </div>
                </div>
            ) : (
                <p className="no-students">No students found for your course.</p>
            )}
        </div>
    );
};

export default FacultyStudents;
