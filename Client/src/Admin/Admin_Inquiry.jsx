import axios from "axios";
import moment from "moment";
import { useEffect, useState } from "react";
import "../assets/AdminInquiry.css"; // ✅ Updated CSS file

function AdminInquiry() {
  const [data, setInquiry] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // ✅ Search query state
  const [currentPage, setCurrentPage] = useState(1);
  const inquiriesPerPage = 5; // ✅ Set inquiries per page

  // ✅ Fetch inquiries from the database
  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        const response = await axios.get("http://localhost:8080/inquiry/submit");
        setInquiry(response.data);
      } catch (err) {
        console.error("Error fetching inquiries", err);
      }
    };
    fetchInquiries();
  }, []);

  // ✅ Filtered inquiries based on search
  const filteredInquiries = data.filter((inquiry) =>
    inquiry.personalDetails.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ✅ Pagination Logic
  const indexOfLastInquiry = currentPage * inquiriesPerPage;
  const indexOfFirstInquiry = indexOfLastInquiry - inquiriesPerPage;
  const currentInquiries = filteredInquiries.slice(indexOfFirstInquiry, indexOfLastInquiry);

  const totalPages = Math.ceil(filteredInquiries.length / inquiriesPerPage);

  return (
    <div className="inquiries-container">
      <div className="inquiries-header">
        <h2>Admin Inquiries</h2>
        <input
          type="text"
          placeholder="Search by Name..."
          className="search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="inquiries-table-container">
        <table className="inquiries-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Mobile No</th>
              <th>Father's No</th>
              <th>Address</th>
              <th>DOB</th>
              <th>Year</th>
              <th>Semester</th>
              <th>College Name</th>
              <th>Course Inquired</th>
              <th>Reference</th>
            </tr>
          </thead>
          <tbody>
            {currentInquiries.map((e) => (
              <tr key={e._id}>
                <td>{e.personalDetails.name}</td>
                <td>{e.personalDetails.mobileNo}</td>
                <td>{e.personalDetails.fathersNo}</td>
                <td>{e.personalDetails.address}</td>
                <td>{moment(e.personalDetails.dob).format("DD-MM-YYYY")}</td>
                <td>{e.academicDetails.stdYear}</td>
                <td>{e.academicDetails.semester}</td>
                <td>{e.academicDetails.schoolCollegeName}</td>
                <td>{e.courseInquired}</td>
                <td>{e.reference}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ✅ Pagination Controls */}
      <div className="pagination">
        <button 
          onClick={() => setCurrentPage(currentPage - 1)} 
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span> Page {currentPage} of {totalPages} </span>
        <button 
          onClick={() => setCurrentPage(currentPage + 1)} 
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default AdminInquiry;
