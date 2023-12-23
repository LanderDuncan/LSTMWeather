import { MongoClient } from "mongodb";
import dotenv from 'dotenv';
if (process.env.NODE_ENV !== 'production') {
	dotenv.config();
}
interface Forecast {
  time: Date;
  temp: number;
}

// Define the document you want to insert
const forecastDocument: Forecast = {
  time: new Date("12/25/2023"), // Replace this with your desired Date value
  temp: 25, // Replace this with your desired temperature value
};

// MongoDB connection URL
let uri: string
if (process.env.URI) {
	uri = process.env.URI
} else {
	throw new Error("URI environment variable is not set")
}

// Database Name
const dbName = 'WeatherApp';

// Collection Name
const collectionName = 'Forecasts';

async function insertForecast() {
  const client = new MongoClient(uri);

  try {
    // Connect to MongoDB
    await client.connect();
    console.log('Connected to the database');

    // Access the WeatherApp database
    const db = client.db(dbName);

    // Access the Forecasts collection
    const collection = db.collection(collectionName);

    // Insert the forecast document into the collection
    const result = await collection.insertOne(forecastDocument);
    console.log(`Inserted a document with the _id: ${result.insertedId}`);
  } catch (err) {
    console.error('Error inserting document:', err);
  } finally {
    // Close the connection
    await client.close();
    console.log('Connection closed');
  }
}

// Call the function to insert the forecast document
insertForecast();
