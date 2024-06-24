import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import cors from "cors";
import helmet from "helmet";
import authRoutes from "./routes/authRoutes";

const app = express();

const server = createServer(app);

export const io = new Server(server, {
  cors: {
    origin:  Bun.env.FRONTEND_URL,
    methods: ["GET", "POST"],
  },
});

app.use(helmet());
app.use(cors({
  origin: Bun.env.FRONTEND_URL,
  credentials: true,
}));
app.use(express.json());

app.use("/api/auth", authRoutes);

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(7000, () => {
  console.log(`Listening on port ${7000}...`);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1); 
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection:", promise, "reason:", reason);
});
