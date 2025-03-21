const express = require("express");
const router = express.Router();
const Controller = require("../Controller/InquiryController");
const upload = require("../middleware/upload"); // Multer for file uploads

router.post("/submit", Controller.submitInquiry);
router.get("/inquiry/submit", Controller.getInquiries);
router.post("/register", Controller.registerStudent);
router.post("/send-email", Controller.sendEmailRegisterUser);
router.put("/inquiry/:id/admit", Controller.admitInquiry);
router.post("/login", Controller.loginUser);
router.get("/register/users", Controller.getRegisteredUsers);
router.post("/student-faculty/register",Controller.registerUser);  // Register route
router.post("/student-faculty/login", Controller.loginUserFaculty);     
router.post("/register/assign-course", Controller.assignCourse);
router.put("/faculty/update/:id", Controller.updateFaculty);
router.get("/faculty/students/:facultyId", Controller.getStudentsByFacultyCourse);
router.get("/faculty/courses/:facultyId", Controller.getCoursesByFaculty);
router.get("/faculty/notes/:facultyId", Controller.getFacultyNotes);
router.post("/faculty/uploadNotes", upload.single("file"), Controller.uploadNotes);
router.delete("/faculty/deleteNote/:noteId", Controller.deleteNote);
router.put("/auth/update-password", Controller.updatePassword);
router.post("/assignments/upload", upload.single("file"), Controller.uploadAssignment);
router.get("/assignments/:facultyId", Controller.getAssignments);
router.delete("/assignments/:assignmentId", Controller.deleteAssignment);
router.get("/notes", Controller.getNotesByCourse);
router.get("/user/:id", Controller.getUserById); 
router.get("/assignments", Controller.getAssignmentsByCourse);
router.get("/student/latest-notes", Controller.getLatestNotes);
router.get("/student/latest-assignments", Controller.getLatestAssignments);
router.post('/forgot-password', Controller.sendResetCode);
router.post('/verify-code', Controller.verifyResetCode);
router.post('/reset-password', Controller.resetPassword);
router.get("/faculty/:id", Controller.getFacultyDashboardData);
// ✅ Student submits an assignment
router.post("/submission/submit", upload.single("file"), Controller.submitAssignment);
router.get("/students/registered", Controller.getRegisteredStudents);
router.get("/faculty", Controller.getAllFaculty);
router.get("/dashboard", Controller.getDashboardStats);

module.exports = router;
