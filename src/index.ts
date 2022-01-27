import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { routes } from "./routes";
import { createServer } from "http";
import { Server } from "socket.io";
import { wsAuthenticated } from "./middlewares/authenticated";

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
const io = new Server(server);

io.use(wsAuthenticated);

io.on("connection", (socket) => {
    console.log("A user connected", socket);
});

server.listen(8000, () => {
    console.log("Server Started on Port: 8000");
});
