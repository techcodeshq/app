import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";
import { routes } from "./routes";

export const app = express();

app.use(express.json());

app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true,
    }),
);

app.use(cookieParser());
app.use(routes);

app.listen(8000, () => {
    console.log("Server Started on Port: 8000");
    console.log(process.env.MONGO_URL);
});
