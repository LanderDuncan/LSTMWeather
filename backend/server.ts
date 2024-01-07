import express from "express";
const app = express();
import path from "path";
const __dirname = path.resolve();
import dotenv from "dotenv";
import modelData from "../models/LSTMjs/model.json";
import { getData } from "./Library/LSTMFunc";

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

// Connect to db
import { MongoClient } from "mongodb";

let uri: string;
if (process.env.URI) {
  uri = process.env.URI;
} else {
  throw new Error("URI environment variable is not set");
}

const client = new MongoClient(uri);

// Configure Express
app.use(express.static(path.join(__dirname, "frontend", "build")));

// Interfaces
interface Forecast {
  time: Date;
  temp: number;
}

interface Prediction {
  creationMills: number;
  predictedTemp: number;
  actualTemp: number;
  predictedSpeed: number;
  actualSpeed: number;
  predictedDegrees: number;
  actualDegrees: number;
}

// Routes
app.get("/api/prediction", async (req, res) => {
  const database = client.db("WeatherApp");
  const predictions = database.collection<Prediction>("Predictions");
  const oneHourAgoMills = new Date();
  oneHourAgoMills.setHours(oneHourAgoMills.getHours() - 1);

  const document = await predictions.findOne({
    creationMills: {
      $gte: oneHourAgoMills.getTime(),
    }
  })

  if (!document) {
    //TODO: Set newDocument values to return values from data
    const data = await getData();

    const newDocument: Prediction = {
      creationMills: new Date().getTime(),
      predictedTemp: 1,
      actualTemp: 1,
      predictedSpeed: 1,
      actualSpeed: 1,
      predictedDegrees: 1,
      actualDegrees: 1,
    };

    // TODO: Send JSON

    await predictions.insertOne(newDocument);
  } else {
    res.json({
      predictedDegrees: document.predictedDegrees,
      predictedSpeed: document.predictedSpeed,
      predictedTemp: document.predictedTemp,
      actualDegrees: document.actualDegrees,
      actualSpeed: document.actualSpeed,
      actualTemp: document.actualTemp,
    })
  }
});

app.get("/tfjs_artifacts/model.json", async (req, res) => {
  res.json(modelData);
});

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

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "build", "index.html"));
});

// Open server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`This app is available on http://localhost:${PORT}/`);
});