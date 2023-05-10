const mongoose = require("mongoose");
const Counter = require("./CounterModel");

const userSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            unique: true,
        },
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
        },
        isAdmin: {
            type: Boolean,
            default: false,
        },
        walletAddress: {
            type: String,
            required: true,
        },
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
        },
    },
    {
        timestamps: true,
    }
);

userSchema.pre("save", async function (next) {
    const doc = this;

    try {
        const user = this;
        const emailExists = await User.findOne({ email: user.email });
        if (emailExists) {
            throw new Error("Email already exists");
        }
        // Find the counter document for the current year, or create it if it doesn't exist
        const counter = await Counter.findOneAndUpdate(
            { _id: `userId` },
            { $inc: { count: 1 } },
            { new: true, upsert: true }
        );

        // Set the studentId to the year followed by the next available number
        doc.userId = `user${counter.count.toString().padStart(3, "0")}`;
        next();
    } catch (err) {
        next(err);
    }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
