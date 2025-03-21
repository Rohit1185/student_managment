const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/HRMANAGEMENT")
  .then(() => console.log("Connection Successful"))
  .catch((err) => console.error("Error While Connecting:", err));
