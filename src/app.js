import express from "express";
import cors from "cors";
import helmet from "helmet";
import { Client } from "node-appwrite";

const app = express();

// Set up CORS.
app.use(cors());

// Set up Helmet.
app.use(helmet());

// Initialize Appwrite.
const appwrtieClient = new Client();

appwrtieClient
  .setEndpoint(process.env.ENDPOINT) // Your API Endpoint
  .setProject(process.env.PROJECT_ID) // Your project ID
  .setKey(process.env.SECRET_KEY) // Your secret API key
  .setSelfSigned();

// Add routes to your app.
app.get("/", (req, res) => {
  res.send("Hello, world!");
});

// Start the server.
app.listen(3000, () => {
  console.log("App listening on port 3000!");
});
