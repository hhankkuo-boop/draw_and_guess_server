/**
 * 啟動 server。負責人:郭奇翰
 *
 * 環境變數:
 *   PORT          監聽埠號,預設 3000
 *   CORS_ORIGIN   允許的前端網址,預設 "*"(開發用)。例如 http://localhost:5173
 */
import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import { registerHandlers } from "./socket/handlers.js";

const PORT = Number(process.env.PORT ?? 3000);
const CORS_ORIGIN = process.env.CORS_ORIGIN ?? "*";

const app = express();
app.use(cors({ origin: CORS_ORIGIN }));
app.get("/", (_req, res) => res.send("draw_and_guess_server running"));
app.get("/health", (_req, res) => res.json({ status: "ok" }));

const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: CORS_ORIGIN } });

io.on("connection", (socket) => registerHandlers(io, socket));

httpServer.listen(PORT, () => console.log(`Server listening on :${PORT}`));

httpServer.on("error", (err: NodeJS.ErrnoException) => {
    if (err.code === "EADDRINUSE") console.error(`Port ${PORT} is already in use.`);
    else console.error(err);
    process.exit(1);
});

// 優雅關閉
function shutdown(): void {
    console.log("Shutting down...");
    io.close(() => process.exit(0));
}
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
