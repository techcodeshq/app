import express, { response } from "express";
import { routes } from "./routes";
import cors from "cors";

export const app = express();

app.use(express.json());

app.use("/", (_, res) => {
    res.send(`
        <html>
        <body>
            <div class="main">
                <h1>Welcome to the TechCodes API! You probably shouldn't be here!</h1>
                <a href="https://app.techcodes.org">
                    <img src="https://app.techcodes.org/logo.svg" alt="app logo"/>
                    <h2>Go to the actual App!</h2>
                </a>
            </div>
        </body>
        <style>
            body { 
                width: 100vw;
                height: 100vh;
                background-color: #121212;
                overflow: hidden;
                color: aliceblue;
            }
            
            a {
                margin-left: 0.2rem;
                display: flex;
                align-items: center;
                text-decoration: none;
                color: #c4c4c4;
            }

            a:hover {
                text-decoration: underline;
            }

            img {
                width: 4rem;
                height: 4rem;
            }

            .main {
                display: flex;
                flex-direction: column;
                align-items: center;
            }
        </style>
        </html>
    `);
});

app.use(cors());
app.use(routes);

app.listen(8000, () => {
    console.log("Server Started on Port: 8000");
});
