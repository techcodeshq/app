import express from "express";
import { app } from "./server";
import { router } from "typera-express";
import { routes } from "./routes";

const main = async () => {
    app.use(express.json());

    app.use(router(...routes).handler());

    app.listen(8000, () => {
        console.log(`Server Started On Port: ${8000}`);
    });
};

main().catch((err) => console.error(err));
