import express from "express";
import cors from "cors";
import helmet from "helmet";
import { Client, Databases, Users } from "node-appwrite";
import {config} from 'dotenv';

const app = express();
config();

// Set up CORS.
app.use(cors());

// Set up Helmet.
app.use(helmet());

// Initialize Appwrite.
const appwrtieClient = new Client();

appwrtieClient
  .setEndpoint("https://cloud.appwrite.io/v1") // Your API Endpoint
  .setProject(process.env.PROJECT_ID) // Your project ID
  .setKey(process.env.SECRET_KEY) // Your secret API key
  .setSelfSigned();

const users = new Users(appwrtieClient);
const database = new Databases(appwrtieClient);
// Add routes to your app.
app.get("/create", async (req, res) => {
  try {
    let promise = await users.create(
      "asdhaknsa",
      "email@example.com",
      undefined,
      "password",
      "Jane Doe"
    );
    res.send(promise);
  } catch (error) {
    console.log({error})
    res.send({
      message: "something went wrong",
    });
  }
});


// Start the server.
app.listen(3001, () => {
  console.log("App listening on port 3001!");
});
