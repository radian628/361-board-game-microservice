import bodyParser from "body-parser";
import express from "express";
import fetch from "node-fetch";
import * as fs from "node:fs/promises";
import cors from "cors";
import { exit } from "node:process";
try {
  var clientID = await fs.readFile("./client-id.txt");
} catch {
  console.error(`ERROR: No client-id.txt found. 
Create a file named client-id.txt in the same directory as microservice.js
and put your Board Game Atlas client ID in it.`);
  exit(1);
}

const app = express();

app.use(cors());

app.use(bodyParser.json());

app.post("/api", async (req, res) => {
  if (typeof req.body != "object") {
    res.status(400);
    res.end("Expected a JSON object in the request body.");
    return;
  }

  let filter = "";

  if (typeof req.body.filter == "object") {
    filter = Object.entries(req.body.filter)
      .map(entry => entry.map(s => encodeURIComponent(s)).join("="))
      .join("&");
  }

  const response = await fetch(`https://api.boardgameatlas.com/api/search?${filter}&client_id=${clientID}`)

  const responseJSON = await response.json();

  if (typeof responseJSON != "object" || response.status != 200) {
    res.status(400);
    res.end(`Request failed: Board game atlas returned ${JSON.stringify(responseJSON)}`);
    return;
  }

  if (Array.isArray(req.body.fields)) {
    const filteredResponseJSON = {
      count: responseJSON.count,
      games: []
    };
    for (const game of responseJSON.games) {
      const filteredGame = {};
      filteredResponseJSON.games.push(filteredGame);
      for (const field of req.body.fields) {
        filteredGame[field] = game[field];
      }
    }
    res.end(JSON.stringify(filteredResponseJSON));
  } else {
    res.end(JSON.stringify(responseJSON));
  }
});

app.listen(8080);