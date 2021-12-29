import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
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

app.listen(8000, () => {
    console.log("Server Started on Port: 8000");
});
