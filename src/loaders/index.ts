import { Application } from "express";
import expressLoader from "./express";
import typeormLoader from "./typeorm";
import dependencyInjectorLoader from "./dependencyInjector";

export default ({ app }: { app: Application }) => {
    typeormLoader();
    expressLoader({ app });
    dependencyInjectorLoader();
}