import { Application } from "express";
import expressLoader from "./express";
import typeormLoader from "./typeorm";
import dependencyInjectorLoader from "./dependencyInjector";

export default async ({ app }: { app: Application }) => {
    await typeormLoader();

    dependencyInjectorLoader();
    
    expressLoader({ app });
}