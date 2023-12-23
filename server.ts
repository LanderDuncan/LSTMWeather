import express from "express";
const app = express();
import path from 'path';
const __dirname = path.resolve();
import dotenv from "dotenv";

if (process.env.NODE_ENV !== 'production') {
	dotenv.config();
  };

// Connect to db
import { MongoClient } from "mongodb";

let uri: string
if (process.env.URI) {
	uri = process.env.URI
} else {
	throw new Error("URI environment variable is not set")
}

const client = new MongoClient(uri);

// Configure Express
app.use(express.static(path.join(__dirname, "frontend", "build")));

// Interfaces
interface Forecast {
	time: Date;
	temp: number;
}

// Routes
app.get("/", (req, res) => {
	res.sendFile(path.join(__dirname, "frontend", "build", "index.html"));
});

app.get("/api/forecast/:startDate/:count", async (req, res) => {
	let recordsToQuery: number = parseInt(req.params.count)
	let startDate: Date = new Date(req.params.startDate);
	if (isNaN(recordsToQuery) || isNaN(startDate.getTime())) {
		// Illegal argument
	}

	try {
		const database = client.db("WeatherApp");
		const forecasts = database.collection<Forecast>("Forecasts");
		const result: Array<Forecast> = [];

		const query = { time: { $gt: startDate } };
		const cursor = forecasts.find<Forecast>(query).limit(recordsToQuery);
		if ((await forecasts.countDocuments(query)) === 0) {
			console.warn("No documents found!");
		}
		for await (const doc of cursor) {
			console.dir(doc);
			result.push(doc);
		}
		res.json(result);
	} catch (error) {
		// Internal server error with database read
	}
});

// Open server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`This app is available on http://localhost:${PORT}/`);
});
