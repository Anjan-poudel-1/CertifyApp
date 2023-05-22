const mongoose = require("mongoose");
const Counter = require("./CounterModel");

const studentSchema = mongoose.Schema(
    {
        studentId: { type: String, unique: true },
        enrolledYear: {
            type: Number,
            required: [true, "Provide student enrolled Year"],
            default: 2020,
        },
        enrolledProgram: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Program",
        },
        isGraduated: {
            type: Boolean,
            default: false,
        },
        results: [
            {
                subject: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Subject",
                },
                marks: { type: Number },
            },
        ],
        certificate: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Certificate",
        },
    },
    {
        timestamps: true,
    }
);

studentSchema.pre("save", async function (next) {
    const doc = this;

    // Extract the year from the enrolledYear field

    const year = doc.enrolledYear;

    // Find the counter document for the current year, or create it if it doesn't exist
    const counter = await Counter.findOneAndUpdate(
        { _id: `studentId_${year}` },
        { $inc: { count: 1 } },
        { new: true, upsert: true }
    );

    // Set the studentId to the year followed by the next available number
    doc.studentId = `${year}${counter.count.toString().padStart(3, "0")}`;
    next();
});

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;

// Example of adding result in postman

// results: [
//     {
//         year: 2020,
//         subjects: [
//             {
//                 subject: ObjectId("5f423423421134f3e24324"),   // Subject ID
//                 marks: 85
//             },
//             {
//                 subject: ObjectId("5f423345325235f3e7653e"),
//                 marks: 90
//             }
//         ]
//     }
// ]
