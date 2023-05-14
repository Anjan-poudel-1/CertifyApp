const express = require("express");
const router = express.Router();
const Subject = require("../models/SubjectModel");

// Create a subject
router.post("/", async (req, res) => {
    try {
        const newSubject = new Subject(req.body);
        const savedSubject = await newSubject.save();
        res.status(200).json(savedSubject);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// all subjects
router.get("/", async (req, res) => {
    try {
        const subjects = await Subject.find({});
        res.status(200).json(subjects);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

//get specific by id
router.get("/:id", async (req, res) => {
    try {
        const subject = await Subject.findById(req.params.id);
        res.status(200).json(subject);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

//   update subject
router.put("/:id", async (req, res) => {
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
router.delete("/:id", async (req, res) => {
    try {
        await Subject.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Subject deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
module.exports = router;
