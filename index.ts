import express, { Request, Response, Application } from "express";
import path from "path";

const mailchimp = require("@mailchimp/mailchimp_marketing");
const crypto = require("crypto");

const countryList = require("country-list");

const bodyParser = require("body-parser");

const apiKey = "e8c1f565de97e3fe0c0b2163ec1b7b8c-us21";
const serverPrefix = "us21";
const myHash = crypto.createHash("sha256").update("subhash2023").digest("hex");
let listId;

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

app.post("/add", async function (req: any, res: any) {
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

app.get("/getCountries", async function (req: any, res: any) {
  try {
    const countries = countryList.getData();

    res.send(countries);
  } catch (error) {
    res.send(error);
  }
});

const getAllList = async function () {
  const response = await mailchimp.lists.getAllLists();

  return response.lists;
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

const run = async () => {
  try {
    const allList = await getAllList();
    listId = allList[0].id; // always return first audience

    console.log(listId);
    

  } catch (error) {
    console.log(error);
    
  }
};

run();
