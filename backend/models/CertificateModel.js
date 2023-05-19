const mongoose = require("mongoose");

const certificateSchema = mongoose.Schema(
    {
        image: {
            type: String,
        },
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
        },
        dateGenerated: {
            type: Date,
            default: Date.now,
        },
        finalPercentage: {
            type: Number,
        },
    },
    {
        timestamps: true,
    }
);

const Certificate = mongoose.model("Certificate", certificateSchema);

module.exports = Certificate;
