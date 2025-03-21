const mongoose = require("mongoose");

const assignmentSubmissionSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Assuming students are stored in a "User" model
        required: true
    },
    facultyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Assuming faculty members are stored in a "Faculty" model
        required: true
    },
    assignmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Assignment", // Reference to the Assignment model
        required: true
    },
    course: {
        type: String,
        required: true
    },
    unitNo: {
        type: Number,
        required: true
    },
    unitName: {
        type: String,
        required: true
    },
    fileUrl: {
        type: String,
        required: true
    },
    submittedAt: {
        type: Date,
        default: Date.now // Automatically sets the submission timestamp
    }
});

// ✅ Export the model
const AssignmentSubmission = mongoose.model("AssignmentSubmission", assignmentSubmissionSchema);
module.exports = AssignmentSubmission;
