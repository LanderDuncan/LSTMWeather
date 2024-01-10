// Imports
import express from "express";
import cors from "cors";
import path from "path";
const __dirname = path.resolve();

import predictionRouter from "../routes/predictionRouter.ts";
import modelRouter from "../routes/modelRouter.ts";

// Configure Express
const app = express();
app.use(express.static(path.join(__dirname, "frontend", "build")));

//Setup Cors
app.use(cors());

// Routes

// Route that gives the actual data from the prediction function
app.use("/api/prediction", predictionRouter);
// Routes that relate to the actual model
app.use("/tfjs_artifacts", modelRouter);

/*
 * This route handles all other routes. As long as the user is not trying to
 * access an API or training route, they will be sent to the React project
 */
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "build", "index.html"));
});

// Open server with default port of 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`This app is available on http://localhost:${PORT}/`);
});
