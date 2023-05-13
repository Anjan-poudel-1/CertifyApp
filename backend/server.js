const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const User = require("./models/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
require("dotenv").config();

const app = express();

const Student = require("./models/StudentModel");
const Subject = require("./models/SubjectModel");
const Program = require("./models/ProgramModel");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

function generateRandomString(length) {
    const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const randomBytes = crypto.randomBytes(length);
    const result = new Array(length);
    for (let i = 0; i < length; i++) {
        const index = randomBytes[i] % characters.length;
        result[i] = characters[index];
    }
    return result.join("");
}

let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com", // replace with your SMTP server hostname
    port: 587, // replace with your SMTP server port
    secure: false, // upgrade later with STARTTLS
    auth: {
        user: "certifyapp092@gmail.com", // replace with your SMTP server username
        pass: `${process.env.EMAIL_PASSWORD}`, // replace with your SMTP server password
    },
});

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
        let password = generateRandomString(8);
        const hashedPassword = await bcrypt.hash(password, 10);
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
        let message = {
            from: "certifyapp092@gmail.com", // replace with sender email address
            to: "panjan19@tbc.edu.np", // replace with recipient email address
            subject: "Student Registration Successful", // replace with subject of the email
            text: `You have been registered as an Student. Do not forget to change your password after you have logged in!! Here is the password ${password}`, // replace with body of the email
        };
        transporter.sendMail(message, (err, info) => {
            if (err) {
                console.log(`Error occurred: ${err.message}`);
                return;
            }
            console.log(`Email sent: ${info.messageId}`);
        });
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
    res.setHeader("Content-Type", "application/json");
    // Check if the email and password are valid
    const user = await User.findOne({ email }).populate("student");
    if (!user) {
        return res.status(401).json({
            message: "Invalid email or password",
            errors: { email: "User not found " },
        });
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
        return res.status(401).json({
            message: "Invalid email or password",
            errors: { password: "Password didnot match" },
        });
    }

    // If the email and password are valid, generate a JWT token and return it
    const token = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET, {
        // expiresIn: "1h",
        expiresIn: "3d",
    });

    res.status(200).json({ token, user });
});

// Create a subject
app.post("/subjects", async (req, res) => {
    try {
        const newSubject = new Subject(req.body);
        const savedSubject = await newSubject.save();
        res.status(200).json(savedSubject);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// all subjects
app.get("/subjects", async (req, res) => {
    try {
        const subjects = await Subject.find({});
        res.status(200).json(subjects);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

//get specific by id
app.get("/subjects/:id", async (req, res) => {
    try {
        const subject = await Subject.findById(req.params.id);
        res.status(200).json(subject);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

//   update subject
app.put("/subjects/:id", async (req, res) => {
    try {
        const updatedSubject = await Subject.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.status(200).json(updatedSubject);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// delete subjects
app.delete("/subjects/:id", async (req, res) => {
    try {
        await Subject.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Subject deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Programs

// Create a program
app.post("/programs", async (req, res) => {
    try {
        const newProgram = new Program(req.body);
        const savedProgram = await newProgram.save();

        const populatedProgram = await Program.populate(
            savedProgram,
            "years.subjects"
        );

        res.status(200).json(populatedProgram);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get all programs
app.get("/programs", async (req, res) => {
    try {
        const programs = await Program.find({}).populate("years.subjects");
        res.status(200).json(programs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get specific program by id
app.get("/programs/:id", async (req, res) => {
    try {
        const program = await Program.findById(req.params.id).populate(
            "years.subjects"
        );
        res.status(200).json(program);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update program
app.put("/programs/:id", async (req, res) => {
    try {
        const updatedProgram = await Program.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.status(200).json(updatedProgram);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Delete program
app.delete("/programs/:id", async (req, res) => {
    try {
        await Program.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Program deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
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
