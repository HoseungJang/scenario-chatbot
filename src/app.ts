import * as express from "express";
import loader from "./loaders";
import * as dotenv from "dotenv";
dotenv.config();

type Application = express.Application;

function startServer(): void {
    const app: Application = express();

    loader({ app });
    app.listen(process.env.PORT);
}

startServer();