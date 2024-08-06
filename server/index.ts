import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import cors from "cors";
import helmet from "helmet";
import authRoutes from "./routes/authRoutes";
import querystring from "querystring";
const app = express();

const server = createServer(app);

export const io = new Server(server, {
  cors: {
    origin:  Bun.env.FRONTEND_URL,
    methods: ["GET", "POST"],
  },
});

function getGoogleAuthURL() {
  const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
  const options = {
    redirect_uri: Bun.env.GOOGLE_REDIRECT_URI as string,
    client_id: Bun.env.GOOGLE_CLIENT_ID,
    access_type: "online",
    response_type: "code",
    prompt: "consent",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ].join(" "),
  };
  return `${rootUrl}?${querystring.stringify(options)}`;
}

app.use(helmet());
app.use(cors({
  origin: Bun.env.FRONTEND_URL,
  credentials: true,
}));

app.get("/callback/google" , (req,res) => {
  res.redirect(getGoogleAuthURL())
})

app.use(express.json());

app.use("/api/auth", authRoutes);

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(9000, () => {
  console.log(`Listening on port ${9000}...`);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1); 
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection:", promise, "reason:", reason);
});
