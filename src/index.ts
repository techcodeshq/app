import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
// import { connect } from "mongoose";
import { routes } from "./routes";

export const app = express();

// connect(process.env.MONGO_URL!, {
//     useNewUrlParser: true,
//     // useFindAndModify: false, // optional
//     // useCreateIndex: true,
//     replicaSet: "rs0",
// } as any);

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
});
