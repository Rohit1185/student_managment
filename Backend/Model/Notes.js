const mongoose = require("mongoose");

const NoteSchema = new mongoose.Schema({
    facultyId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
    course: { type: String, required: true },
    unitName: { type: String, required: true }, // ✅ Added Unit Name
    fileUrl: { type: String, required: true },
    filename: { type: String, required: true },
    uploadedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Note", NoteSchema);
