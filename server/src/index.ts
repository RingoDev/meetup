import dotenv from "dotenv";
import mongoose from "mongoose";
import webSocket from "ws";
import http from "http";
import { initializeDB } from "./mongoDatastore";
import middleware from "./ws/middleware";

if (process.env.NODE_ENV !== "production") dotenv.config();

const websocketServer = http.createServer((req, res) => {
  console.log(new Date() + " Received request for " + req.url);
  res.writeHead(404);
  res.end();
});

console.log(`Starting websocket server on port ${process.env.PORT}`);

websocketServer.listen(process.env.PORT);
const wss = new webSocket.Server({ server: websocketServer });

wss.on("connection", middleware);

//Connect to Mongo-DB
mongoose
  .connect(process.env.DB_CONNECTION ? process.env.DB_CONNECTION : "")
  .then((_value) => {
    console.log("connected to DB");
    initializeDB();
  })
  .catch((err) => console.log("Failed Connection to DB", err));
