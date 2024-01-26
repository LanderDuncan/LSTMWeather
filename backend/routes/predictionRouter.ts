import express from "express";
import Prediction from "../interfaces/Prediction";
import getData from "../library/LSTMFunc";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";

const predictionRouter = express.Router();

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

predictionRouter.get("/", async (req, res) => {
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
      data = {...await getData(), creationMills: new Date().getTime()};
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

    // Send the user the data and insert it into the database
    res.json(data);
    await predictions.insertOne(data);
  } else {
    // If a document was created within this hour, send its data to the endpoint
    res.json(document);
  }
});

export default predictionRouter;
