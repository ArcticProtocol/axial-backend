import express from "express";
import cors from "cors";
import helmet from "helmet";
import { Client, Databases, Users, Storage, ID, Query } from "node-appwrite";
import { config } from "dotenv";
import bodyParser from "body-parser";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";

const DATABASE_ID = "64833c274cad6042d395";
const USERS_COLLECTION = "64833fb90a22f4514a54";
const PROJECTS_COLLECTION = "6483940e5b3f272d4f13";
const REGISTRY_COLLECTION = "64839a83ce183c5b59ea";
const TRANSACTION_COLLECTION = "6485f6b641f04b90d267";
const PROPOSAL_COLLECTION = "6485f9998c5feeb8f113";

config();
const app = express();

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
const storage = new Storage(appwrtieClient);

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

// Add routes to your app.
app.post("/createUser", async (req, res) => {
  try {
    let uuid = uuidv4();

    let userBody = {
      userID: uuid,
      publicKey: req.body.address,
      name: req.body.name,
    };

    let user = await database.createDocument(
      DATABASE_ID,
      USERS_COLLECTION,
      uuid,
      userBody
    );

    res.send({
      userMeta: user,
    });
  } catch (error) {
    console.log({ error });
    res.send({
      message: "something went wrong",
    });
  }
});

app.get("/userStatus", async (req, res) => {
  try {
    let userData = await database.listDocuments(DATABASE_ID, USERS_COLLECTION, [
      Query.equal("publicKey", req.query.address),
    ]);
    let userExists = userData && userData.documents[0] != null;

    res.send({
      userExists,
      user: userData.documents[0],
    });
  } catch (error) {
    console.log({ error });
    res.send({
      message: "something went wrong",
    });
  }
});

app.post("/createProject", async (req, res) => {
  try {
    console.log(req.body);

    let result = await database.createDocument(
      DATABASE_ID,
      PROJECTS_COLLECTION,
      req.body.projectId,
      req.body
    );
    res.send(result);
  } catch (error) {
    console.log({ error });
    res.send({
      message: "something went wrong",
    });
  }
});

app.post("/transaction", async (req, res) => {
  try {
    let uuid = uuidv4();
    const timestamp = moment().utc().toString();

    let body = {
      transactionId: uuid,
      timestamp,

      ...req.body,
    };

    let result = await database.createDocument(
      DATABASE_ID,
      TRANSACTION_COLLECTION,
      uuid,
      body
    );
    res.send(result);
  } catch (error) {
    console.log({ error });
    res.send({
      message: "something went wrong",
    });
  }
});

app.get("/projectTransactions", async (req, res) => {
  try {
    let result = await database.listDocuments(
      DATABASE_ID,
      PROJECTS_COLLECTION,
      [Query.equal("projectId", req.query.projectId)]
    );

    res.send(result.documents);
  } catch (error) {
    console.log({ error });
    res.send({
      message: "something went wrong",
    });
  }
});

app.get("/projectDetails", async (req, res) => {
  try {
    let result = await database.getDocument(
      DATABASE_ID,
      PROJECTS_COLLECTION,
      req.query.projectId
    );

    res.send(result);
  } catch (error) {
    console.log({ error });
    res.send({
      message: "something went wrong",
    });
  }
});

app.get("/userProjects", async (req, res) => {
  try {
    let result = await database.listDocuments(
      DATABASE_ID,
      PROJECTS_COLLECTION,
      [Query.equal("owner", req.query.address)]
    );

    res.send(result.documents);
  } catch (error) {
    console.log({ error });
    res.send({
      message: "something went wrong",
    });
  }
});

app.get("/projects", async (req, res) => {
  try {
    let result = await database.listDocuments(DATABASE_ID, PROJECTS_COLLECTION);
    res.send(result.documents);
  } catch (error) {
    console.log({ error });
    res.send({
      message: "something went wrong",
    });
  }
});

app.post("/registerOffset", async (req, res) => {
  try {
    let uuid = uuidv4();
    const timestamp = moment().utc().toString();

    let body = {
      timestamp,
      ...req.body,
    };

    console.log({ body });

    let result = await database.createDocument(
      DATABASE_ID,
      REGISTRY_COLLECTION,
      uuid,
      body
    );
    res.send(result);
  } catch (error) {
    console.log({ error });
    res.send({
      message: "something went wrong",
    });
  }
});

app.get("/userOffsets", async (req, res) => {
  try {
    let result = await database.listDocuments(
      DATABASE_ID,
      REGISTRY_COLLECTION,
      [Query.equal("owner", req.query.address)]
    );

    res.send(result.documents);
  } catch (error) {
    console.log({ error });
    res.send({
      message: "something went wrong",
    });
  }
});

app.get("/registry", async (req, res) => {
  try {
    let result = await database.listDocuments(DATABASE_ID, REGISTRY_COLLECTION);
    res.send(result.documents);
  } catch (error) {
    console.log({ error });
    res.send({
      message: "something went wrong",
    });
  }
});

app.post("/createProposal", async (req, res) => {
  try {
    let uuid = uuidv4();
    const timestamp = moment().utc().toString();

    let body = {
      timestamp,
      ...req.body,
    };

    console.log({ body });

    let result = await database.createDocument(
      DATABASE_ID,
      PROPOSAL_COLLECTION,
      uuid,
      body
    );
    res.send(result);
  } catch (error) {
    console.log({ error });
    res.send({
      message: "something went wrong",
    });
  }
});

app.get("/projectProposals", async (req, res) => {
  try {
    let result = await database.listDocuments(
      DATABASE_ID,
      PROPOSAL_COLLECTION,
      [Query.equal("projectId", req.query.projectId)]
    );

    res.send(result.documents);
  } catch (error) {
    console.log({ error });
    res.send({
      message: "something went wrong",
    });
  }
});

app.get("/proposals", async (req, res) => {
  try {
    let result = await database.listDocuments(DATABASE_ID, PROPOSAL_COLLECTION);

    console.log(result);
    res.send(result.documents);
  } catch (error) {
    console.log({ error });
    res.send({
      message: "something went wrong",
    });
  }
});

app.post("/upload", (req, res) => {
  // Access the uploaded file via req.file
  if (req.file) {
    // File upload successful
    res.status(200).json({ message: "File uploaded successfully" });
  } else {
    // No file was uploaded
    res.status(400).json({ error: "No file uploaded" });
  }
});

// Start the server.
app.listen(3001, () => {
  console.log("App listening on port 3001!");
});
