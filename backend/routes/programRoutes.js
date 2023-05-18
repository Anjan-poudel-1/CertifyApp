// Programs
const express = require("express");
const router = express.Router();
const Program = require("../models/ProgramModel");

// Create a program
router.post("/", async (req, res) => {
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
router.get("/", async (req, res) => {
    try {
        const programs = await Program.find({}).populate({
            path: "years.subjects",
            model: "Subject",
        });
        res.status(200).json(programs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get specific program by id
router.get("/:id", async (req, res) => {
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
router.put("/:id", async (req, res) => {
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
router.delete("/:id", async (req, res) => {
    try {
        await Program.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Program deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
module.exports = router;
