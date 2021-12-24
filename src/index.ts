import express, { response } from "express";
import { routes } from "./routes";
import cors from "cors";

export const app = express();

app.use(express.json());

app.use(cors());
app.use(routes);

app.listen(8000, () => {
    console.log("Server Started on Port: 8000");
});
