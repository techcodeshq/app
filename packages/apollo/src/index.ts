import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { registerGateways } from "./gateway";
import { routes } from "./routes";

export const app = express();

app.use(express.json());

app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);

app.use(cookieParser());
app.use(routes);

const server = createServer(app);
export const io = new Server(server, {
  cors: {
    origin: true,
    credentials: true,
  },
});

export const namespaces = registerGateways(io);

// io.use(wsAuthenticated);

// io.on("connection", (socket) => {
//     socket.send("connected");
// });

server.listen(8000, () => {
  console.log("Server Started on Port: 8000");
});
