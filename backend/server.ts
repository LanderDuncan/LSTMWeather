// Imports
import express from "express";
import { MongoClient } from "mongodb";
const app = express();
import path from "path";
const __dirname = path.resolve();
import dotenv from "dotenv";
import modelData from "../models/LSTMjs/model.json";
import getData from "./Library/LSTMFunc";

// Import the prediction interface
import Prediction from "../interfaces/Prediction";

/*
 * If not running in the production environment, use the .env file to get
 * environment variables
 */
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

/*
 * Set the database connection to whatever is in the .env file set as URI.
 * If that doesn't exist throw an error
 */
const uri = process.env.URI;
if (!uri) throw new Error("URI environment variable is not set");

// Connect to MongoDB
const client = new MongoClient(uri);

// Configure Express
app.use(express.static(path.join(__dirname, "frontend", "build")));

//Setup Cors
import cors from "cors";
app.use(cors());

// Routes

//Route that gives the actual data from the prediction function
app.get("/api/prediction", async (req, res) => {
  const database = client.db("WeatherApp");
  const predictions = database.collection<Prediction>("Predictions");
  const oneHourAgoMills = new Date();
  oneHourAgoMills.setHours(oneHourAgoMills.getHours() - 1);

  /*
   * Search the database for a document, if one exists,
   * that was created within the last hour
   */
  const document = await predictions.findOne({
    creationMills: {
      $gte: oneHourAgoMills.getTime(),
    },
  });

  if (!document) {
    // Only run this code if there is no prediction from the last hour
    let data: Prediction;
    try {
      // Set data to the data from within this current hour
      data = await getData();
    } catch (error) {
      /*
       * If the data from the actual weather API has any errors,
       * set data to the next most recent data
       */
      console.log(error);
      const allPredictions = await predictions
        .find()
        .sort({ creationMills: -1 })
        .limit(1)
        .toArray();
      data = allPredictions[0];
    }

    // Create a new document to be inserted into the database
    const newDocument: Prediction = {
      creationMills: new Date().getTime(),
      predictedTemp: data.predictedTemp,
      actualTemp: data.actualTemp,
      predictedSpeed: data.predictedSpeed,
      actualSpeed: data.actualSpeed,
      predictedDegrees: data.predictedDegrees,
      actualDegrees: data.actualDegrees,
    };

    // Send the user the data and insert it into the database
    res.json(newDocument);
    await predictions.insertOne(newDocument);
  } else {
    // If a document was created within this hour, send its data to the endpoint
    res.json(document);
  }
});

/*
 * Route that returns the training data for the model.
 * This is used in the LSTMFunc.ts File
 */
app.get("/tfjs_artifacts/model.json", async (req, res) => {
  res.json(modelData);
});

// Route that downloads the binary of the prediction model
app.get("/tfjs_artifacts/group1-shard1of1.bin", async (req, res) => {
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
