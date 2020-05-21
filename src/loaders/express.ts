import { Application, Request, Response, NextFunction, urlencoded } from "express";
import * as morgan from "morgan";
import router from "../api";

export default ({ app }: { app: Application }) => {
    app.use(morgan("dev"));

    app.use(urlencoded({ extended: true }));

    app.use(router());

    app.use((req: Request, res: Response, next: NextFunction) => {
        const err: Error = new Error("Not found");

        err["status"] = 404;
        next(err);
    });

    app.use((err: any, req: Request, res: Response, next: NextFunction) => {
        return res.sendStatus(err.status ?? 500);
    });
}