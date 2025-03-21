  const Inquiry = require("../Model/Inquiry");
  const nodemailer = require("nodemailer");
  const Register = require("../Model/Register");
  const AssignmentSubmission = require("../Model/Assignment_Submission");
  const crypto = require('crypto');
  const User = require('../Model/UserFacult')

  exports.submitInquiry = async (req, res) => {
    try {
      const { personalDetails, academicDetails, courseInquired, reference } = req.body;

      // 🔴 Validate Required Fields
      if (
        !personalDetails.name ||
        !personalDetails.mobileNo ||
        !personalDetails.fathersNo ||
        !personalDetails.address ||
        !personalDetails.dob ||
        !personalDetails.email ||
        !academicDetails.stdYear ||
        !academicDetails.semester ||
        !academicDetails.schoolCollegeName
      ) {
        return res.status(400).json({ message: "All required fields must be filled!" });
      }

      // ✅ Save Inquiry Data
      const newInquiry = new Inquiry({
        personalDetails,
        academicDetails,
        courseInquired,
        reference,
      });

      await newInquiry.save();

      // ✅ Send Thank-You Email
      await sendEmail(personalDetails.email, personalDetails.name);

      res.status(201).json({ message: "Inquiry submitted successfully! A confirmation email has been sent." });
    } catch (error) {
      console.error("Error saving inquiry:", error);
      res.status(500).json({ message: "Internal Server Error", error });
    }
  };

  // ✅ Function to Send Email
  const sendEmail = async (userEmail, userName) => {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "petadoptionplatform.amd@gmail.com", // Replace with your email
        pass: "bbxd lsys jfsd uftd", // Replace with your generated App Password
      },
    });

    let mailOptions = {
      from: "petadoptionplatform.amd@gmail.com",
      to: userEmail,
      subject: "Thank You for Your Inquiry!",
      html: `
        <h2>Hello ${userName},</h2>
        <p>Thank you for reaching out to us! We have received your inquiry and will get back to you soon.</p>
        <p>Here are the details you submitted:</p>
        <ul>
          <li><strong>Name:</strong> ${userName}</li>
          <li><strong>Email:</strong> ${userEmail}</li>
        </ul>
        <p>We appreciate your interest and will contact you shortly.</p>
        <br/>
        <p>Best regards,</p>
        <p><strong>Cliclaway IT Solutions</strong></p>
      `,
    };

    await transporter.sendMail(mailOptions);
  };
  exports.getInquiries = async (req, res) => {
    try {
      const inquiries = await Inquiry.find();
      res.status(200).json(inquiries);
    } catch (error) {
      console.error("Error fetching inquiries:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };


  exports.registerStudent = async (req, res) => {
    try {
      const newRegistration = new Register(req.body);
      await newRegistration.save();
      res.status(201).json({ message: "Student registered successfully!" });
    } catch (error) {
      console.error("Error registering student:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  const bcrypt = require('bcrypt')
  const generateUsername = (name) => {
    return name.toLowerCase().replace(/\s/g, "") + Math.floor(1000 + Math.random() * 9000);
  };

  // ✅ Helper function to generate random password
  const generatePassword = () => {
    return Math.random().toString(36).slice(-8); // 8-character random password
  };

  exports.sendEmailRegisterUser = async (req, res) => {
    const { email, name, course, personalDetails, academicDetails, reference } = req.body;

    // ✅ Generate username & password
    const username = generateUsername(name);
    const password = generatePassword();
    const hashedPassword = await bcrypt.hash(password, 10); // Hash password before storing

    try {
      // ✅ Save to Register collection
      await Register.findOneAndUpdate(
        { "personalDetails.email": email }, // Find user by email
        { 
          username, 
          password: hashedPassword, 
          personalDetails, 
          academicDetails, 
          reference, 
          status: "Admitted" 
        }, 
        { new: true, upsert: true } // ✅ Create if not exists
      );

      // ✅ Send Email with login credentials
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "petadoptionplatform.amd@gmail.com",
          pass: "bbxd lsys jfsd uftd",
        },
      });

      const mailOptions = {
        from: "petadoptionplatform.amd@gmail.com",
        to: email,
        subject: "🎉 Admission Confirmation - Clickaway IT Solutions",
        html: `
          <h2>Dear ${name},</h2>
          <p>Congratulations! Your admission is confirmed at <b>Clickaway IT Solutions</b>.</p>
          <p>Your Course: <b>${course}</b></p>
          <p><b>Your Login Credentials:</b></p>
          <ul>
            <li><b>Username:</b> ${username}</li>
            <li><b>Password:</b> ${password}</li>
          </ul>
          <p>We are excited to have you on board!</p>
          <br>
          <p>Best Regards,</p>
          <p>Clickaway IT Solutions Team</p>
        `,
      };

      await transporter.sendMail(mailOptions);
      res.status(200).json({ message: "User registered & email sent!", username, password });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ message: "Failed to process request" });
    }
  };
  exports.admitInquiry = async (req, res) => {
    try {
      const { id } = req.params;
      const updatedInquiry = await Inquiry.findByIdAndUpdate(
        id,
        { admitted: true },
        { new: true }
      );

      if (!updatedInquiry) {
        return res.status(404).json({ error: "Inquiry not found" });
      }

      res.status(200).json({ message: "Inquiry admitted successfully!" });
    } catch (error) {
      res.status(500).json({ error: "Failed to update admission status" });
    }
  };
  exports.getRegisteredUsers = async (req, res) => {
    try {
      const users = await Register.find();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch registered users" });
    }
  };
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "petadoptionplatform.amd@gmail.com", // Use environment variable
      pass: "bbxd lsys jfsd uftd", // Use environment variable
    },
  });
  const sendCourseAssignmentEmail = async (email, name, course, duration, faculty, company) => {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Course Assignment Confirmation",
      html: `
        <h2>Hello ${name},</h2>
        <p>You have been successfully assigned to the <strong>${course}</strong> course.</p>
        <p><strong>Course Duration:</strong> ${duration}</p>
        <p><strong>Faculty:</strong> ${faculty}</p>
        <p><strong>Company:</strong> ${company}</p>
        <p>We look forward to seeing you in the course!</p>
        <p>Best Regards,<br/>Your Institution</p>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log("✅ Email sent successfully to:", email);
    } catch (error) {
      console.error("❌ Error sending email:", error);
      throw new Error("Failed to send email");
    }
  };

  // ✅ Assign Course Controller
  exports.assignCourse = async (req, res) => {
    try {
      const { userId, courseName, duration, faculty, company } = req.body;

      // ✅ Update User with Assigned Course
      const updatedUser = await Register.findByIdAndUpdate(
        userId,
        { courseAssigned: { courseName, duration, faculty, company } },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }

      // ✅ Extract Correct Email & Name
      const userEmail = updatedUser.personalDetails.email;
      const userName = updatedUser.personalDetails.name;

      if (!userEmail) {
        return res.status(400).json({ error: "User email not found" });
      }

      // ✅ Call Email Function (This is now properly defined)
      await sendCourseAssignmentEmail(userEmail, userName, courseName, duration, faculty, company);

      res.status(200).json({ message: "Course assigned and email sent successfully!" });
    } catch (error) {
      console.error("Error assigning course:", error);
      res.status(500).json({ error: "Failed to assign course" });
    }
  };
  exports.loginUser = async (req, res) => {
    const { username, password } = req.body;
    console.log("Username and Password",username,password)
    try {
      // ✅ Find user by username
      const user = await Register.findOne({ username });
      console.log("User",user)
      if (!user) {
        return res.status(401).json({ message: "Invalid username or password" });
      }
      res.status(200).json({ message: "Login successful",user});

    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Server error" });
    }
  };
  
  exports.registerUser = async (req, res) => {
      try {
          console.log("Received Registration Request:", req.body);
  
          const { name, email, password, role, additional_info } = req.body;
  
          // ✅ Validate required fields
          if (!name || !email || !password || !role) {
              return res.status(400).json({ message: "All fields are required" });
          }
  
          // ✅ Check if the role is valid
          if (!["student", "faculty"].includes(role)) {
              return res.status(400).json({ message: "Invalid role specified" });
          }
  
          // ✅ Check if the user already exists
          const existingUser = await User.findOne({ email });
          console.log("Existing User:", existingUser);
          if (existingUser) {
              return res.status(400).json({ message: "User already exists" });
          }
  
          // ✅ Validate `additional_info` based on role
          if (role === "student" && !additional_info?.enrollment_number) {
              return res.status(400).json({ message: "Enrollment number is required for students" });
          }
          if (role === "faculty" && (!additional_info?.employee_id)) {
              return res.status(400).json({ message: "Employee ID required for faculty" });
          }
  
          // ✅ Hash the password before saving
          const hashedPassword = await bcrypt.hash(password, 10);
  
          // ✅ Create new user
          const newUser = new User({
              name,
              email,
              password: hashedPassword,
              role,
              additional_info,
          });
  
          console.log("Saving New User:", newUser);
          await newUser.save();
  
          res.status(201).json({ message: "User registered successfully!", user: newUser });
  
      } catch (error) {
          console.error("Error Registering User:", error);
          res.status(500).json({ message: "Server error", error: error.message });
      }
  };
  

  // Login user
  exports.loginUserFaculty = async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log("username and passwors",username,password)
        // Find user by email
        const user = await User.findOne({ email:username });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Send user details (excluding password)
        res.status(200).json({
            message: "Login successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                additional_info: user.additional_info
            }
        });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
  };
  exports.updateFaculty = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, department, employeeID } = req.body;

        // Find and update faculty by ID
        const updatedFaculty = await User.findByIdAndUpdate(
            id,
            { name, "additional_info.department": department, "additional_info.employee_id": employeeID },
            { new: true }
        );

        if (!updatedFaculty) {
            return res.status(404).json({ message: "Faculty not found" });
        }

        res.status(200).json({ message: "Profile updated successfully", faculty: updatedFaculty });
    } catch (error) {
        res.status(500).json({ message: "Error updating faculty profile", error });
    }
  };

  exports.getStudentsByFacultyCourse = async (req, res) => {
      try {
          const faculty = await User.findById(req.params.facultyId); // Find faculty by ID
          if (!faculty) {
              return res.status(404).json({ message: "Faculty not found" });
          }

          // Fetch students where role is 'student' and course matches faculty's course
          const students = await User.find({ role: "student", course: faculty.course });

          res.status(200).json(students);
      } catch (error) {
          res.status(500).json({ error: "Server error", details: error.message });
      }
  };
  exports.getCoursesByFaculty = async (req, res) => {
    try {
        const courses = await Course.find({ facultyId: req.params.facultyId });
        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
  };
  const Note = require('../Model/Notes')
  exports.uploadNotes = async (req, res) => {
    try {
        console.log(req.body);
        
        if (!req.file) {
            return res.status(400).json({ error: "File upload failed" });
        }

        const fileUrl = `http://localhost:8080/uploads/${req.file.filename}`;

        // Validate required fields
        if (!req.body.facultyId || !req.body.course || !req.body.unitName) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        // Create a new note entry in MongoDB
        const newNote = new Note({
            facultyId: req.body.facultyId,
            course: req.body.course,
            unitName: req.body.unitName, // ✅ Added unit name
            fileUrl: fileUrl,
            filename: req.file.filename
        });

        // Save to database
        await newNote.save();

        res.status(201).json({ message: "File uploaded successfully!", note: newNote });
    } catch (error) {
        console.error("Error uploading file:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};



  // Get faculty notes
  exports.getFacultyNotes = async (req, res) => {
    console.log("Req body",req.body)
    try {
        const notes = await Note.find({ facultyId: req.params.facultyId });
        console.log("Notes of Faculty Into Controller",notes)
        res.status(200).json(notes);
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
  };

  // Delete note
  exports.deleteNote = async (req, res) => {
    try {
        await Note.findByIdAndDelete(req.params.noteId);
        res.status(200).json({ message: "Note deleted" });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
  };

  exports.updatePassword = async (req, res) => {
    try {
        const { userId, currentPassword, newPassword } = req.body;

        // Validate input
        if (!userId || !currentPassword || !newPassword) {
            return res.status(400).json({ error: "All fields are required." });
        }

        // Find user by ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }

        // Check if the current password is correct
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Incorrect current password." });
        }

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update password in the database
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: "Password updated successfully!" });
    } catch (error) {
        console.error("Error updating password:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
  };
  const Assignment = require('../Model/Assignment');

  exports.uploadAssignment = async (req, res) => {
    try {
        const { facultyId, course, unitNo, unitName, dueDate, submissionLink } = req.body;

        if (!req.file) {
            return res.status(400).json({ error: "File upload required" });
        }

        const assignment = new Assignment({
            facultyId,
            course,
            unitNo,  // ✅ Added Unit No.
            unitName, // ✅ Added Unit Name.
            fileUrl: `http://localhost:8080/uploads/${req.file.filename}`,
            dueDate,
            submissionLink
        });

        await assignment.save();
        res.status(201).json({ message: "Assignment uploaded successfully!", assignment });
    } catch (error) {
        console.error("Error uploading assignment:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};


  // Get Assignments for a Faculty
  exports.getAssignments = async (req, res) => {
    try {
        const assignments = await Assignment.find({ facultyId: req.params.facultyId });
        res.status(200).json(assignments);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch assignments" });
    }
  };

  // Delete Assignment
  exports.deleteAssignment = async (req, res) => {
    try {
        await Assignment.findByIdAndDelete(req.params.assignmentId);
        res.status(200).json({ message: "Assignment deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete assignment" });
    }
  };
  
  exports.getNotesByCourse = async (req, res) => {
    try {
      const { course } = req.query;
  
      if (!course) {
        return res.status(400).json({ message: "Course parameter is required" });
      }
  
      // Find notes related to the specified course
      const notes = await Note.find({ course });
  
      res.json(notes);
    } catch (error) {
      console.error("Error fetching notes:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  exports.getUserById = async (req, res) => {
    try {
      const { id } = req.params;
      const user = await User.findById(id);
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.status(200).json({ _id: user._id, name: user.name });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Server error fetching user" });
    }
  };
  exports.getAssignmentsByCourse = async (req, res) => {
    try {
      const { course } = req.query;
      if (!course) {
        return res.status(400).json({ message: "Course is required" });
      }
  
      // Fetch assignments for the selected course
      const assignments = await Assignment.find({ course });
  
      res.json(assignments);
    } catch (error) {
      console.error("Error fetching assignments:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
exports.getLatestNotes = async (req, res) => {
  try {
    const notes = await Note.find().sort({ createdAt: -1 }).limit(5);

    // Fetch faculty names from User collection
    const facultyIds = notes.map(note => note.facultyId);
    const facultyData = await User.find({ _id: { $in: facultyIds } }, "name");

    // Create a mapping of facultyId -> facultyName
    const facultyMap = {};
    facultyData.forEach(faculty => {
      facultyMap[faculty._id] = faculty.name;
    });

    // Attach faculty names to notes
    const notesWithFaculty = notes.map(note => ({
      ...note._doc, // Spread note document
      facultyName: facultyMap[note.facultyId] || "Unknown Faculty",
    }));

    res.status(200).json(notesWithFaculty);
  } catch (error) {
    res.status(500).json({ message: "Error fetching notes", error: error.message });
  }
};

// ✅ Fetch latest 5 submitted assignments with faculty name
exports.getLatestAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find().sort({ submittedAt: -1 }).limit(5);

    // Fetch faculty names from User collection
    const facultyIds = assignments.map(assignment => assignment.facultyId);
    const facultyData = await User.find({ _id: { $in: facultyIds } }, "name");

    // Create a mapping of facultyId -> facultyName
    const facultyMap = {};
    facultyData.forEach(faculty => {
      facultyMap[faculty._id] = faculty.name;
    });

    // Attach faculty names to assignments
    const assignmentsWithFaculty = assignments.map(assignment => ({
      ...assignment._doc, // Spread assignment document
      facultyName: facultyMap[assignment.facultyId] || "Unknown Faculty",
    }));

    res.status(200).json(assignmentsWithFaculty);
  } catch (error) {
    res.status(500).json({ message: "Error fetching assignments", error: error.message });
  }
};


exports.sendResetCode = async (req, res) => {
  const { email } = req.body;
  console.log("Email is", email);

  try {
    // Check if user exists
    const user = await User.findOne({  email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate a 6-digit reset token using crypto
    const token = crypto.randomInt(100000, 999999).toString();
    console.log("Generated Token:", token);

    // Store the token and expiration time in the database
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // Expires in 1 hour
    await user.save({validateBeforeSave: false });

    console.log("User Email:", user.email);
    console.log("Token Saved:", user.resetPasswordToken);

    // Configure email options
    const mailOptions = {
      from: "petadoptionplatform.amd@gmail.com",
      to: user.email,
      subject: "Password Reset Code",
      text: `Your password reset code is: ${token}`,
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Email Error:", error);
        return res.status(500).json({ message: "Error sending email" });
      }
      res.status(200).json({ message: "Code sent to your email" });
    });

  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
exports.verifyResetCode = async (req, res) => {
  const { email, code } = req.body;

  try {
    console.log("Verifying Reset Code...");
    console.log("Email:", email);
    console.log("Received Code:", code);

    // Find user by email
    const user = await User.findOne({  email });

    if (!user) {
      console.log("User not found.");
      return res.status(404).json({ message: "User not found" });
    }

    console.log("User Found:", user);

    // Ensure resetPasswordToken and resetPasswordExpires exist
    if (!user.resetPasswordToken || !user.resetPasswordExpires) {
      console.log("Reset token or expiration is missing.");
      return res.status(400).json({ message: "Reset token not found. Please request a new code." });
    }

    console.log("Stored Token:", user.resetPasswordToken);
    console.log("Stored Expiry Time:", new Date(user.resetPasswordExpires));
    console.log("Current Time:", new Date());

    // Validate reset code
    if (user.resetPasswordToken !== code) {
      console.log("Invalid reset code.");
      return res.status(400).json({ message: "Invalid reset code." });
    }

    // Check if the token has expired
    if (user.resetPasswordExpires < Date.now()) {
      console.log("Reset code has expired.");
      return res.status(400).json({ message: "Reset code has expired. Please request a new one." });
    }

    console.log("Code verified successfully.");
    return res.status(200).json({ message: "Code verified" });

  } catch (error) {
    console.error("Error verifying reset code:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
exports.resetPassword = async (req, res) => {
  console.log("🔹 Reset Password Endpoint Hit!");
  console.log("🔹 Request Body:", req.body);

  const { email, code, newPassword } = req.body;
  console.log("🔹 Extracted Data:", email, code, newPassword);

  if (!email || !code || !newPassword) {
    console.log("❌ Missing fields in request body");
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    console.log("🔹 Searching user in database...");
    const user = await User.findOne({
      email,
      resetPasswordToken: code,
      resetPasswordExpires: { $gt: Date.now() }, // Ensure token is not expired
    });

    if (!user) {
      console.log("❌ Invalid or expired reset code");
      return res.status(400).json({ message: "Invalid or expired reset code" });
    }

    console.log("✅ User found. Hashing new password...");
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt); // Hash password before saving

    // Remove reset token and expiration
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save({ validateBeforeSave: false });

    console.log("✅ Password updated successfully");
    res.status(200).json({ message: "Password reset successfully" });

  } catch (error) {
    console.error("❌ Error resetting password:", error);
    res.status(500).json({ message: "Server error" });
  }
};
exports.getFacultyDashboardData = async (req, res) => {
  try {
    const facultyId = req.params.id;
    console.log("Fetching data for facultyId:", facultyId);

    // 🔹 Fetch Assignments uploaded by the faculty
    const facultyAssignments = await Assignment.find({ facultyId });

    // 🔹 Fetch Notes uploaded by the faculty
    const facultyNotes = await Note.find({ facultyId });

    // 🔹 Fetch Assignment Submissions related to faculty's assignments
    const assignmentIds = facultyAssignments.map(a => a._id);
    const facultySubmissions = await AssignmentSubmission.find({ assignmentId: { $in: assignmentIds } });

    // 🔹 Extract unique student IDs from submissions
    const studentIds = facultySubmissions.map(submission => submission.studentId);

    // 🔹 Fetch Student Data (Name, Enrollment Number, Course)
    const studentData = await User.find({ _id: { $in: studentIds } },   "name additional_info.enrollment_number additional_info.courses"
    );
    const studentMap = {};
    studentData.forEach(student => {
      studentMap[student._id] = {
        studentName: student.name,
        enrollmentNo: student.additional_info?.enrollment_number || "N/A",
    course: student.additional_info?.courses || "N/A",
      };
    });

    // 🔹 Fetch Assignment Details (Unit No, Unit Name, Due Date)
    const assignmentDetails = await Assignment.find({ _id: { $in: assignmentIds } }, "unitNo unitName dueDate");
    const assignmentMap = {};
    assignmentDetails.forEach(assignment => {
      assignmentMap[assignment._id] = {
        unitNo: assignment.unitNo,
        unitName: assignment.unitName,
        dueDate: assignment.dueDate,
      };
    });

    // 🔹 Attach Student & Assignment Details to Submissions
    const submissionsWithDetails = facultySubmissions.map(submission => ({
      ...submission._doc,
      studentName: studentMap[submission.studentId]?.studentName || "Unknown Student",
      enrollmentNo: studentMap[submission.studentId]?.enrollmentNo || "N/A",
      course: studentMap[submission.studentId]?.course || "N/A",
      unitNo: assignmentMap[submission.assignmentId]?.unitNo || "N/A",
      unitName: assignmentMap[submission.assignmentId]?.unitName || "N/A",
      dueDate: assignmentMap[submission.assignmentId]?.dueDate || "N/A",
    }));

    res.status(200).json({
      assignments: facultyAssignments,
      notes: facultyNotes,
      submissions: submissionsWithDetails, // Now includes student & assignment details
    });

  } catch (error) {
    console.error("Error fetching faculty dashboard data:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.submitAssignment = async (req, res) => {
    try {
        
        // ✅ Extract data from req.body
        const { facultyId, studentId, assignmentId, course, unitNo, unitName } = req.body;
        const fileUrl = req.file ? `http://localhost:8080/uploads/${req.file.filename}` : null;
        console.log(req.body)
        // ✅ Validate required fields
        if (!facultyId || !studentId || !assignmentId || !course || !unitNo || !unitName) {
            return res.status(400).json({ message: "All fields are required!" });
        }

        if (!fileUrl) {
            return res.status(400).json({ message: "File upload is required!" });
        }

        // ✅ Check if assignment exists
        const assignment = await Assignment.findById(assignmentId);
        if (!assignment) {
            return res.status(404).json({ message: "Assignment not found!" });
        }
        console.log("Assignemntt",assignment)
        // ✅ Create new submission entry
        const submission = new AssignmentSubmission({
            studentId,
            facultyId,
            assignmentId,
            course,
            unitNo,
            unitName,
            fileUrl,
        });

        await submission.save();

        res.status(201).json({ message: "Assignment submitted successfully!", submission });

    } catch (error) {
        console.error("Error submitting assignment:", error);
        res.status(500).json({ message: "Internal server error", error });
    }
};
exports.getRegisteredStudents = async (req, res) => {
  try {
    const students = await User.find({ role: "student" }); // Fetch students only
    res.status(200).json(students);
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ message: "Server error" });
  }
};
exports.getAllFaculty = async (req, res) => {
  try {
    const facultyMembers = await User.find({ role: "faculty" }); // Filter by role
    res.status(200).json(facultyMembers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching faculty members", error });
  }
};
exports.getDashboardStats = async (req, res) => {
  try {
    const totalInquiries = await Inquiry.countDocuments();
    const totalStudents = await User.countDocuments({ role: "student" });
    const totalFaculty = await User.countDocuments({ role: "faculty" });
    const totalNotes = await Note.countDocuments();
    const totalAssignments = await Assignment.countDocuments();
    const totalSubmissions = await AssignmentSubmission.countDocuments();

    res.status(200).json({
      totalInquiries,
      totalStudents,
      totalFaculty,
      totalNotes,
      totalAssignments,
      totalSubmissions,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching dashboard data", error });
  }
};
