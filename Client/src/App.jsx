import { Route, Routes, BrowserRouter } from "react-router-dom";
import { useState } from "react";
import AdminNavbar from "./Admin/AdminNav";
import Admin_Inquiry from "./Admin/Admin_Inquiry";
import Admin_RegisterUsers from "./Admin/Admin_User";
import Admin_AssignCourse from "./Admin/Admin_Course";
import Register from './Components/Register'
import "./index.css";
import QRCodeGenerator from "./Components/QRCode";
import InquiryForm from "./Components/Inquiry";
import Login from "./Components/Login";
import ContextLogin from "./Context/Login";
import Student_Dashboard from "./Components/Student_Dashboard";
import Navbar from "./Components/Navbar";
import FacultyProfile from "./Faculty/Profile";
import FacultyStudents from "./Faculty/Students";
import Courses from './Faculty/Courses'
import UpdatePassword from "./Components/Forgotpass";
import FacultyDashboard from "./Faculty/Dashboard";
import FacultyAssignmentUpload from "./Faculty/AssignmentUpload";
import NotesPage from "./Student/Student_Notes";
import StudentAssignment from './Student/Student_assignment';
import ProfilePage from "./Student/Student_Profile";
import AssignmentSubmission from "./Student/Student_Assignment_Submission";
import ForgotPassword from "./Components/Forgotpassword";
import AdminDashboard from "./Admin/Admin_dashboard";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(""); // Student | Faculty | Admin
  const [user,setUser] = useState("");

  return (
    <ContextLogin.Provider value={{ isLoggedIn, setIsLoggedIn, userRole, setUserRole ,user,setUser}}>
      <BrowserRouter>
        {/* ✅ Show the Navbar based on the User Role */}
        {userRole !== "Admin" && <Navbar />}
        
        <div className="app-container">
          {/* ✅ Show Admin Navbar only if Admin is logged in */}
          {isLoggedIn && userRole === "Admin" && <AdminNavbar />}

          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* ✅ Admin Routes */}
            {isLoggedIn && userRole === "Admin" && (
              <>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/inquiries" element={<Admin_Inquiry />} />
                <Route path="/admin/users" element={<Admin_RegisterUsers />} />
                <Route path="/admin/faculty" element={<Admin_AssignCourse />} />
              </>
            )}

            {/* ✅ Student Route */}
            {isLoggedIn && userRole === "student" && (
              <>
              <Route path="/student-dashboard" element={<Student_Dashboard />} />
              <Route path="/update-pass" element={<UpdatePassword/>}></Route>
              <Route path="/notes" element={<NotesPage/>}></Route>
              <Route path="/assignments" element={<StudentAssignment/>}></Route>
              <Route path="/profile" element={<ProfilePage/>}></Route>
              {/* <Route path="/assignment-submission" element={<AssignmentSubmission/>}></Route>  */}
              
              </>
            )}

            {isLoggedIn && userRole === "faculty" && (
              <>
              <Route path="/profile" element={<FacultyProfile />} />
              <Route path="/students" element={<FacultyStudents/>}></Route>
              <Route path="/manage-courses" element={<Courses/>}></Route>
              <Route path="/update-pass" element={<UpdatePassword/>}></Route>
              <Route path="/faculty-dashboard" element={<FacultyDashboard/>}></Route>
              <Route path="/upload-assigments" element={<FacultyAssignmentUpload/>}></Route>
              </>
            )}

            {/* ✅ Public Route */}
            <Route path="/submit-assignment" element={<AssignmentSubmission/>}></Route>
            <Route path="/login/forgot-password" element={<ForgotPassword/>}></Route>
            <Route path="/" element={<InquiryForm />} />
          </Routes>
        </div>
      </BrowserRouter>
    </ContextLogin.Provider>
  );
}

export default App;
