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

const certificateRoutes = require("./routes/certificateRoutes");
const programRoutes = require("./routes/programRoutes");
const studentRoutes = require("./routes/studentRoutes");
const subjectRoutes = require("./routes/subjectRoutes");
const Certificate = require("./models/CertificateModel");
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

app.get("/stats", async (req, res) => {
    try {
        const totalStudents = await Student.countDocuments();
        const totalPrograms = await Program.countDocuments();
        const totalCertificates = await Certificate.countDocuments({
            dateGenerated: { $ne: null },
        });

        res.json({
            totalStudents,
            totalPrograms,
            totalCertificates,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching data" });
    }
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
            const newCertificate = new Certificate({});
            let savedCertificate = await newCertificate.save();
            console.log("savedCertificate", savedCertificate);
            const newStudent = new Student({
                enrolledYear: req.body.enrolledYear,
                isGraduated: req.body.isGraduated,
                enrolledProgram: req.body.enrolledProgram,
                certificate: savedCertificate._id,
            });
            savedStudent = await newStudent.save();
        }
        let password = req.body.isAdmin
            ? req.body.password
            : generateRandomString(8);
        const hashedPassword = await bcrypt.hash(password, 10);

        let newUser = null;
        if (req.body.isAdmin) {
            newUser = new User({
                name: req.body.name,
                email: req.body.email,
                password: hashedPassword,
                isAdmin: req.body.isAdmin,
                walletAddress: req.body.walletAddress,
            });
        } else {
            newUser = new User({
                name: req.body.name,
                email: req.body.email,
                password: hashedPassword,
                isAdmin: req.body.isAdmin,
                walletAddress: req.body.walletAddress,
                student: savedStudent && savedStudent._id,
            });
        }

        let populatedUser = null;

        const savedUser = await newUser.save();

        if (req.body.isAdmin) {
        } else {
            populatedUser = await savedUser.populate({
                path: "student",
                populate: [
                    { path: "enrolledProgram", model: "Program" },
                    { path: "certificate", model: "Certificate" },
                ],
            });
        }

        let message = {
            from: "certifyapp092@gmail.com", // replace with sender email address
            to: "panjan19@tbc.edu.np", // replace with recipient email address
            subject: "Student Registration Successful", // replace with subject of the email
            html: `
        <div>
            <h1>Welcome to CertifyApp!</h1>
            <p>Dear Student,</p>
            <p>We are glad to inform you that your registration as a student has been successful. Here is your temporary password:</p>
            <p><strong>Password: ${password}</strong></p>
            <p><strong>Registered Wallet Address: ${req.body.walletAddress}</strong></p>
            <p>Please remember to change your password after you have logged in for the first time.</p>
            <hr>
            <p style="color: red;"><strong>Warning:</strong> For your account security, it is important to change your password as soon as possible.</p>
        </div>`,
        };

        if (!req.body.isAdmin) {
            transporter.sendMail(message, (err, info) => {
                if (err) {
                    console.log(`Error occurred: ${err.message}`);
                    return;
                }
                console.log(`Email sent: ${info.messageId}`);
            });
        }

        res.status(200).json(populatedUser);
    } catch (err) {
        console.log(err);

        res.status(500).json({ message: err.message });
    }
});
// Fetch Users
app.get("/users", async (req, res) => {
    try {
        const usersData = await User.find({}).populate({
            path: "student",
            populate: [
                {
                    path: "enrolledProgram",
                },
            ],
        });
        res.status(200).json(usersData);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
});

app.put("/users/:id", async (req, res) => {
    try {
        const updatedSubject = await User.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        )
            .populate({
                path: "student",
                populate: { path: "enrolledProgram" },
            })
            .exec();
        res.status(200).json(updatedSubject);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.put("/students/:id", async (req, res) => {
    try {
        const updatedStudent = await Student.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        )
            .populate("certificate")
            .populate("results.subject");

        res.status(200).json(updatedStudent);
    } catch (err) {
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
        })
            .populate({
                path: "student",
                populate: [
                    { path: "enrolledProgram" },
                    { path: "certificate", model: "Certificate" },
                ],
            })
            .exec();
        res.status(200).json(populatedData);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
});

// Search Student
app.get("/usersearch", async (req, res) => {
    try {
        const { search } = req.query;

        // Build the filter object based on the provided search query
        const filter = {
            $or: [
                { name: { $regex: new RegExp(search, "i") } },
                { email: { $regex: new RegExp(search, "i") } },
                { walletAddress: { $regex: new RegExp(search, "i") } },
            ],
            isAdmin: false, // Exclude users where isAdmin is true
        };

        const users = await User.find(filter)
            .populate({
                path: "student",
                populate: { path: "enrolledProgram" },
            })
            .exec();

        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
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

app.put("/users/:id/change-password", async (req, res) => {
    try {
        const { id } = req.params;
        const { currentPassword, newPassword } = req.body;

        // Check if the current password is correct
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        console.log(currentPassword);
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Hash the new password and update the user's password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await User.findByIdAndUpdate(
            id,
            { password: hashedPassword },
            { new: true }
        );

        res.status(200).json({ message: "Password updated successfully" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
});

app.post("/studentres/:studentId/results", async (req, res) => {
    try {
        const student = await Student.findById(req.params.studentId);
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        student.results.push(req.body);
        await student.save();

        res.status(201).json({
            message: "Result added successfully",
            data: student.results[student.results.length - 1],
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get("/studentres/:studentId/results", async (req, res) => {
    try {
        const student = await Student.findById(req.params.studentId);
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        res.status(200).json({
            message: "Results fetched successfully",
            data: student.results[0] || [],
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.put("/studentres/:studentId/results/:resultId", async (req, res) => {
    try {
        const student = await Student.findById(req.params.studentId);
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        const resultIndex = student.results.findIndex(
            (result) => result.id === req.params.resultId
        );

        if (resultIndex === -1) {
            return res.status(404).json({ message: "Result not found" });
        }

        student.results[resultIndex] = req.body;
        await student.save();

        res.status(200).json({
            message: "Result updated successfully",
            data: student.results[resultIndex],
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get("/graph-data", async (req, res) => {
    const data = [];

    // Students enrolled per year
    const enrolledData = {
        name: "Students Enrolled per Year",
        description: "Number of students enrolled in each year",
        labels: [],
        datasets: { data: [] },
    };

    const enrolledResults = await Student.aggregate([
        { $group: { _id: "$enrolledYear", count: { $sum: 1 } } },
    ]);
    enrolledResults.forEach((result) => {
        enrolledData.labels.push(result._id);

        enrolledData.datasets.data &&
            enrolledData.datasets.data.push(result.count);
    });
    data.push(enrolledData);

    // Certificates generated per year
    const certificateData = {
        name: "Students Graduated Per Year",
        description: "Number of students graduated  generated per year",
        labels: [],
        datasets: { data: [] },
    };

    const certificateResults = await Certificate.aggregate([
        { $group: { _id: { $year: "$dateGenerated" }, count: { $sum: 1 } } },
    ]);
    certificateResults.forEach((result) => {
        certificateData.labels.push(result._id);

        certificateData.datasets.data &&
            certificateData.datasets.data.push(result.count);
    });
    console.log("certificateData", certificateData);
    data.push(certificateData);

    // Get number of students in each program
    const programData = {
        name: "Number of Students per Program",
        description: "Number of students enrolled in each program",
        labels: [],
        datasets: { data: [] },
    };

    const programResults = await Program.aggregate([
        {
            $lookup: {
                from: "students",
                localField: "_id",
                foreignField: "enrolledProgram",
                as: "enrolledStudents",
            },
        },
        { $unwind: "$enrolledStudents" },
        {
            $group: {
                _id: "$name",
                count: { $sum: 1 },
            },
        },
    ]);
    programResults.forEach((result) => {
        programData.labels.push(result._id);

        programData.datasets.data &&
            programData.datasets.data.push(result.count);
    });
    data.push(programData);

    res.json(data);
});

app.post("/login", async (req, res) => {
    const { email, password, walletAddress } = req.body;
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
    const isWalletCorrect = user.walletAddress == walletAddress;

    if (!isWalletCorrect) {
        return res.status(401).json({
            message: "Signed In with Different Wallet",
        });
    }

    // If the email and password are valid, generate a JWT token and return it
    const token = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET, {
        // expiresIn: "1h",
        expiresIn: "3d",
    });

    res.status(200).json({ token, user });
});

app.use("/programs", programRoutes);
app.use("/subjects", subjectRoutes);
app.use("/certificates", certificateRoutes);

mongoose
    .connect("mongodb://localhost:27017/Certify", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then((res) => {
        console.log("Connected to  certify database");
        app.listen(3001, () => {
            console.log("Listening to port 3001");
        });
    })
    .catch((err) => {
        console.log("Couldnot connect");
    });
