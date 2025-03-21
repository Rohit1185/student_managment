const mongoose = require("mongoose");

const AssignmentSchema = new mongoose.Schema({
    facultyId: { type: mongoose.Schema.Types.ObjectId, ref: "Faculty", required: true },
    course: { type: String, required: true },
    unitNo: { type: Number, required: true }, // ✅ Added Unit No.
    unitName: { type: String, required: true }, // ✅ Added Unit Name
    fileUrl: { type: String, required: true },
    dueDate: { type: Date, required: true },
    submissionLink: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Assignment", AssignmentSchema);
