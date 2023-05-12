const mongoose = require("mongoose");

const programSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
        },
        description: {
            type: String,
        },
        years: [
            {
                subjects: [
                    {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "Subject",
                    },
                ],
            },
        ],
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

const Program = mongoose.model("Program", programSchema);

module.exports = Program;
