const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const User = require("./models/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();

const Student = require("./models/StudentModel");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Routes
app.get("/", (req, res) => {
    res.send("Namaste");
});

// Create User
app.post("/users", async (req, res) => {
    try {
        let savedStudent = {};
        if (!req.body.isAdmin) {
            const newStudent = new Student({
                enrolledYear: req.body.enrolledYear,
                isGraduated: req.body.isGraduated,
            });
            savedStudent = await newStudent.save();
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
            isAdmin: req.body.isAdmin,
            walletAddress: req.body.walletAddress,
            student: (savedStudent && savedStudent._id) || null,
        });
        const savedUser = await newUser.save();
        const populatedUser = await savedUser.populate("student");

        res.status(200).json(populatedUser);
    } catch (err) {
        console.log(err);

        res.status(500).json({ message: err.message });
    }
});
// Fetch Users
app.get("/users", async (req, res) => {
    try {
        const usersData = await User.find({}).populate("student", "-_id -__v");
        res.status(200).json(usersData);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
});

// Get user by Id
app.get("/users/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        const userData = await User.findOne({ userId: userId });
        if (!userData) {
            return res.status(404).json({
                message: `Cannot find User with userId ${userId}`,
            });
        }
        const populatedData = await User.findOne({
            userId: userId,
        }).populate("student", "-_id -__v");
        res.status(200).json(populatedData);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
});

// Search Student
app.get("/users", async (req, res) => {
    try {
        const searchQuery = req.query.search;
        let query = {};

        // If a search query is provided, match on either name or studentId
        if (searchQuery) {
            query = {
                $or: [
                    {
                        "student.studentId": {
                            $regex: searchQuery,
                            $options: "i",
                        },
                    },
                    { name: { $regex: searchQuery, $options: "i" } },
                ],
            };
        }

        const users = await User.find(query).populate("student");

        if (!users || users.length === 0) {
            return res
                .status(404)
                .json({ message: "No matching users found." });
        }

        res.status(200).json(users);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
});

// Update a student
app.put("/students/:studentId", async (req, res) => {
    try {
        const { studentId } = req.params;
        const userData = await Student.findOneAndUpdate(
            { studentId: studentId },
            req.body,
            { new: true }
        );
        //    Cannot find data in database
        if (!userData) {
            return res.status(404).json({
                message: `Cannot find Student with studentId ${studentId}`,
            });
        }
        res.status(200).json(userData);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
});

app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    // Check if the email and password are valid
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid email or password" });
    }

    // If the email and password are valid, generate a JWT token and return it
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        // expiresIn: "1h",
        expiresIn: null,
    });
    res.status(200).json({ token });
});

mongoose
    .connect("mongodb://localhost:27017/Certify")
    .then((res) => {
        console.log("Connected to  certify database");
        app.listen(3001, () => {
            console.log("Listening to port 3001");
        });
    })
    .catch((err) => {
        console.log("Couldnot connect");
    });
