import axios from "axios";
import { useEffect, useState } from "react";
import { ClipboardList, Users, User, FileText, UploadCloud, FileCheck } from "lucide-react"; 
import "../assets/AdminDashboard.css"; // Import styles

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalInquiries: 0,
    totalStudents: 0,
    totalFaculty: 0,
    totalNotes: 0,
    totalAssignments: 0,
    totalSubmissions: 0,
  });

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const response = await axios.get("http://localhost:8080/dashboard");
        setStats(response.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };
    fetchDashboardStats();
  }, []);

  return (
    <div className="dashboard-container">
      <h2>Admin Dashboard</h2>
      <div className="dashboard-grid">
        <DashboardCard title="Total Inquiries" count={stats.totalInquiries} icon={<ClipboardList />} />
        <DashboardCard title="Total Students" count={stats.totalStudents} icon={<Users />} />
        <DashboardCard title="Total Faculty" count={stats.totalFaculty} icon={<User />} />
        <DashboardCard title="Total Notes" count={stats.totalNotes} icon={<FileText />} />
        <DashboardCard title="Total Assignments" count={stats.totalAssignments} icon={<UploadCloud />} />
        <DashboardCard title="Total Submissions" count={stats.totalSubmissions} icon={<FileCheck />} />
      </div>
    </div>
  );
}

// ✅ Reusable Card Component
const DashboardCard = ({ title, count, icon }) => {
  return (
    <div className="dashboard-card">
      <div className="icon">{icon}</div>
      <div className="info">
        <h3>{title}</h3>
        <p>{count}</p>
      </div>
    </div>
  );
};

export default AdminDashboard;
