import axios from "axios";
import { useEffect, useState } from "react";
import "../assets/FacultyList.css"; // Import styles

function FacultyList() {
  const [faculty, setFaculty] = useState([]);
  const [filteredFaculty, setFilteredFaculty] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const facultyPerPage = 5;

  // ✅ Fetch Faculty Members
  useEffect(() => {
    const fetchFaculty = async () => {
      try {
        const response = await axios.get("http://localhost:8080/faculty");
        setFaculty(response.data);
        setFilteredFaculty(response.data);
      } catch (error) {
        console.error("Error fetching faculty members:", error);
      }
    };
    fetchFaculty();
  }, []);

  // ✅ Search Function
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = faculty.filter(
      (member) =>
        member.name.toLowerCase().includes(query) ||
        member.email.toLowerCase().includes(query) ||
        member.additional_info?.employee_id?.toLowerCase().includes(query)
    );

    setFilteredFaculty(filtered);
    setCurrentPage(1);
  };

  // ✅ Pagination Logic
  const indexOfLastFaculty = currentPage * facultyPerPage;
  const indexOfFirstFaculty = indexOfLastFaculty - facultyPerPage;
  const currentFaculty = filteredFaculty.slice(indexOfFirstFaculty, indexOfLastFaculty);

  return (
    <div className="faculty-container">
      <h2>Faculty Members</h2>

      {/* ✅ Search Input */}
      <input
        type="text"
        placeholder="Search by name, email, or employee ID"
        value={searchQuery}
        onChange={handleSearch}
        className="search-input"
      />

      <table className="faculty-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Department</th>
            <th>Employee ID</th>
          </tr>
        </thead>
        <tbody>
          {currentFaculty.map((member) => (
            <tr key={member._id}>
              <td>{member.name}</td>
              <td>{member.email}</td>
              <td>{member.additional_info?.courses || "N/A"}</td>
              <td>{member.additional_info?.employee_id || "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ✅ Pagination Controls */}
      <div className="pagination">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Prev
        </button>
        <span>Page {currentPage} of {Math.ceil(filteredFaculty.length / facultyPerPage)}</span>
        <button
          onClick={() =>
            setCurrentPage((prev) =>
              prev < Math.ceil(filteredFaculty.length / facultyPerPage) ? prev + 1 : prev
            )
          }
          disabled={currentPage === Math.ceil(filteredFaculty.length / facultyPerPage)}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default FacultyList;
