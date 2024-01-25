import express from "express";
import modelData from "../../models/LSTMjs/model.json";
import path from "path";
const __dirname = path.resolve();

const modelRouter = express.Router();

// Route that returns the training data for the model
modelRouter.get("/model.json", async (req, res) => {
  res.json(modelData);
});

// Route that downloads the binary of the prediction model
modelRouter.get("/group1-shard1of1.bin", async (req, res) => {
  const filePath = path.join(__dirname, "/models/LSTMjs/group1-shard1of1.bin");

  // Sending the file as a download
  res.download(filePath, "group1-shard1of1.bin", (err) => {
    if (err) {
      // Handle errors, such as the file not existing
      console.log(err);
      res.status(404).send("File not found");
    }
  });
});

export default modelRouter;