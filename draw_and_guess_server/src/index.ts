/**
 * 啟動 server。負責人:郭奇翰
 */
import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import { registerHandlers } from "./socket/handlers.js";

const app = express();
app.use(cors());
app.get("/", (_req, res) => res.send("draw_and_guess_server running"));

const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: "*" } });

io.on("connection", (socket) => registerHandlers(io, socket));

const PORT = Number(process.env.PORT ?? 3000);
httpServer.listen(PORT, () => console.log(`Server listening on :${PORT}`));
