const express = require("express");
const dotenv = require("dotenv");
const fileRoutes = require("./routes/fileRoutes.js")

dotenv.config();

const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json());

app.use("/api", fileRoutes);

app.listen(PORT, () => {
    console.log(`Server Running on port ${PORT}`)
});