const mongoose = require("mongoose");
const Counter = require("./CounterModel");

const subjectSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
        },
        subjectCode: {
            type: String,
            unique: true,
        },
        creditHours: {
            type: Number,
        },
        description: {
            type: String,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

subjectSchema.pre("save", async function (next) {
    const doc = this;
    console.log("pre-save hook called");
    try {
        // Find the counter document for the current year, or create it if it doesn't exist
        const counter = await Counter.findOneAndUpdate(
            { _id: `sub` },
            { $inc: { count: 1 } },
            { new: true, upsert: true }
        );

        // Set the studentId to the year followed by the next available number
        doc.subjectCode = `SUB${counter.count.toString().padStart(3, "0")}`;
        next();
    } catch (err) {
        next(err);
    }
});

const Subject = mongoose.model("Subject", subjectSchema);

module.exports = Subject;
