import axios from "axios";
import { useEffect, useState, useContext } from "react";
import userContext from "../Context/Login"; // ✅ Import user context
import "../assets/AdminStudents.css"; // ✅ Updated CSS file

function AdminStudents() {
  const { isLoggedIn, userRole } = useContext(userContext);
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [studentCount, setStudentCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 5;

  // ✅ Fetch Students & Count
  const fetchStudents = async () => {
    try {
      const response = await axios.get("http://localhost:8080/students/registered");
      setStudents(response.data);
      setFilteredStudents(response.data);
      setStudentCount(response.data.length);
    } catch (err) {
      console.error("Error fetching students:", err.message);
    }
  };

  useEffect(() => {
    if (isLoggedIn && userRole === "Admin") {
      fetchStudents();
    }
  }, [isLoggedIn, userRole]);

  // ✅ Search Function
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = students.filter((student) =>
      student.name.toLowerCase().includes(query) ||
      student.email.toLowerCase().includes(query) ||
      student.additional_info?.enrollment_number?.toLowerCase().includes(query)
    );

    setFilteredStudents(filtered);
    setCurrentPage(1);
  };

  // ✅ Pagination Logic
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);

  return (
    <div className="students-container">
      <div className="students-header">
        <h2>Registered Students</h2>
        <p><strong>Total Students:</strong> {studentCount}</p>
        <input
          type="text"
          placeholder="Search by name, email, or enrollment"
          value={searchQuery}
          onChange={handleSearch}
          className="search-input"
        />
      </div>

      <div className="students-table-container">
        <table className="students-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Enrollment No.</th>
              <th>Course</th>
            </tr>
          </thead>
          <tbody>
            {currentStudents.map((student) => (
              <tr key={student._id}>
                <td>{student?.name || "N/A"}</td>
                <td>{student?.email || "N/A"}</td>
                <td>{student?.role || "N/A"}</td>
                <td>{student?.additional_info?.enrollment_number || "N/A"}</td>
                <td>{student?.additional_info?.courses || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ✅ Pagination Controls */}
      <div className="pagination">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Prev
        </button>
        <span>Page {currentPage} of {Math.ceil(filteredStudents.length / studentsPerPage)}</span>
        <button
          onClick={() =>
            setCurrentPage((prev) =>
              prev < Math.ceil(filteredStudents.length / studentsPerPage) ? prev + 1 : prev
            )
          }
          disabled={currentPage === Math.ceil(filteredStudents.length / studentsPerPage)}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default AdminStudents;
