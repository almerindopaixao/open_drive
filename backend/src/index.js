import https from "https";
import fs from "fs";
import { Server } from "socket.io";

import Routes from "./routes.js";
import Log from './services/Log.js';

const PORT = process.env.PORT || 3200;

const key = fs.readFileSync(`./certificates/key.pem`);
const cert = fs.readFileSync("./certificates/cert.pem");

const localHostSSL = {
  key,
  cert,
};

const log = new Log();
const routes = new Routes(log);
const server = https.createServer(localHostSSL, routes.handler.bind(routes));

const io = new Server(server, {
  cors: {
    origin: "*",
    credentials: false,
  },
});

io.on("connection", (socket) => log.info(`someone connected: ${socket.id}`));

const startServer = () => {
  const { address, port } = server.address();
  log.info_log(`app running at https://${address}:${port}`);
};

server.listen(PORT, startServer);
