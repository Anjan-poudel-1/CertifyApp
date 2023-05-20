const express = require("express");
const router = express.Router();
const Certificate = require("../models/CertificateModel");
const Student = require("../models/StudentModel");

// CREATE
router.post("/", async (req, res) => {
    try {
        const newCertificate = new Certificate({
            _id: new mongoose.Types.ObjectId(),
            image: req.body.image,
            student: req.body.student,
            dateGenerated: req.body.dateGenerated,
            finalPercentage: req.body.finalPercentage,
        });
        const savedCertificate = await newCertificate.save();
        res.status(201).json(savedCertificate);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// READ
router.get("/:id", async (req, res) => {
    try {
        const certificate = await Certificate.findById(req.params.id).populate(
            "student"
        );
        res.status(200).json(certificate);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
});

// UPDATE
router.put("/:id", async (req, res) => {
    try {
        const updatedCertificate = await Certificate.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.status(200).json(updatedCertificate);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE
router.delete("/:id", async (req, res) => {
    try {
        const removedCertificate = await Certificate.findByIdAndRemove(
            req.params.id
        );
        res.status(200).json(removedCertificate);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
});

module.exports = router;
