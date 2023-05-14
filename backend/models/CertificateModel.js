const mongoose = require("mongoose");

const certificateSchema = mongoose.Schema(
    {
        _id: mongoose.Schema.Types.ObjectId,
        image: {
            type: String,
            required: true,
        },
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
            required: true,
        },
        dateGenerated: {
            type: Date,
            required: true,
            default: Date.now,
        },
        finalPercentage: {
            type: Number,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Certificate = mongoose.model("Certificate", certificateSchema);

module.exports = Certificate;
