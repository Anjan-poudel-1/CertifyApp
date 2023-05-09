const express = require("express");
const app = express();

// Routes
app.get("/", (req, res) => {
    res.send("NAmaste");
});

app.listen(3001, () => {
    console.log("Mero naam anjan");
});
