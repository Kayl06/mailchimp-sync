import express, { Request, Response, Application } from "express";
import path from "path";

const mailchimp = require("@mailchimp/mailchimp_marketing");
const crypto = require("crypto");

const bodyParser = require("body-parser");

const apiKey = "d77548aa9ede169200bfe5d87342eff1-us21";
const serverPrefix = "us21";
const listId = "51176f9c99";
const myHash = crypto.createHash("sha256").update("subhash2023").digest("hex");

const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const fs = require("fs");

mailchimp.setConfig({
  apiKey: apiKey,
  server: serverPrefix,
});

const app: Application = express();
const PORT = process.env.PORT || 8000;

app.use(express.static(path.join(__dirname, "public")));

app.use(bodyParser.json());

app.get("/", (req: Request, res: Response): void => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/dist/output.css", (req: Request, res: Response) => {
  res.setHeader("Content-Type", "text/css");
  res.sendFile(path.join(__dirname, "dist", "output.css"));
});

app.get("/src/FileUpload.js", (req: Request, res: Response) => {
  res.setHeader("Content-Type", "text/javascript");
  res.sendFile(path.join(__dirname, "src", "FileUpload.js"));
});

app.get("/src/GetMembers.js", (req: Request, res: Response) => {
  res.setHeader("Content-Type", "text/javascript");
  res.sendFile(path.join(__dirname, "src", "GetMembers.js"));
});

app.get("/src/DownloadMembers.js", (req: Request, res: Response) => {
  res.setHeader("Content-Type", "text/javascript");
  res.sendFile(path.join(__dirname, "src", "DownloadMembers.js"));
});

app.post("/upload", async function (req: any, res: any) {
  const json = req.body;

  try {
    const response = await mailchimp.lists.setListMember(listId, myHash, json, {
      skipMergeValidation: true,
    });
    res.send(response);
  } catch (error) {
    res.send(error);
  }
});

app.get("/getMembers", async function (req: any, res: any) {
  try {
    const response = await mailchimp.lists.getListMembersInfo(listId, {
      count: 120,
    });

    res.send(response.members);
  } catch (error) {
    res.send(error);
  }
});

app.get("/export-csv", async function (req: any, res: any) {
  try {
    const encodedData = req.query.data;
    const decodedData = decodeURIComponent(encodedData);
    const data = JSON.parse(decodedData);

    res.send(data);

    // Define the CSV writer and the output file path
    const csvWriter = createCsvWriter({
      path: "mailchimp_contacts.csv",
      header: [
        { id: "email_address", title: "Email Address" },
        { id: "first_name", title: "First Name" },
        { id: "last_name", title: "Last Name" },
        { id: "address", title: "Address" },
        { id: "phone", title: "Phone" },
      ],
    });

    // Write the data to the CSV file
    csvWriter
      .writeRecords(data)
      .then(() => console.log("The CSV file was written successfully"))
      .catch((err: any) => console.error(err));

    const file = "mailchimp_contacts.csv";

    // Read the file from disk and send it as a response to the client
    fs.readFile(file, (err: any, data: any) => {
      if (err) {
        console.error(err);
        res.status(500).end();
      } else {
        res.setHeader(
          "Content-disposition",
          "attachment; filename=mailchimp_contacts.csv"
        );
        res.set("Content-Type", "text/csv");
        res.status(200).send(data);
      }
    });
  } catch (error) {
    res.send(error);
  }
});

const getAllList = async function () {
  const response = await mailchimp.lists.getAllLists();
  console.log(response);
};

const getList = async () => {
  const response = await mailchimp.lists.getList(listId);
  console.log(response);
};

const getListMembersInfo = async () => {
  try {
    const response = await mailchimp.lists.getListMembersInfo(listId, {
      count: 120,
    });
    console.log(response.members);
  } catch (error) {
    console.log(error);
  }
};

const addMemberToList = async (data: object) => {
  try {
    const response = await mailchimp.lists.addListMember(listId, data, {
      skipMergeValidation: true,
    });

    return response;
  } catch (error) {
    return error;
  }
};

app.listen(PORT, (): void => {
  console.log(`Server Running here 👉 http://localhost:${PORT}`);
});

const run = async () => {};

run();
