const express = require("express");
const app = express();

if (process.env.NODE_ENV !== "production") {
	require("dotenv").config();
}

app.use(express.static("pubic"));

app.get("/", (req, res) => {
	res.send("Hello, World!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`This app is available on http://localhost:${PORT}/`);
});
