const mongoose = require("mongoose");

const certificateSchema = mongoose.Schema({
    certificateId: { type: String, unique: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
    issueDate: { type: Date, default: Date.now },
    finalPercentage: { type: Number, required: true },
    certificateURL: { type: String }, // URL of the certificate image
});

const Certificate = mongoose.model("Certificate", certificateSchema);
