const express = require("express");
const path = require("path");
const app = express();

if (process.env.NODE_ENV !== "production") {
	require("dotenv").config();
}

app.use(express.static(path.join(__dirname, "frontend", "build")));

app.get("/", (req, res) => {
	res.sendFile(path.join(__dirname, "frontend", "build", "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`This app is available on http://localhost:${PORT}/`);
});
