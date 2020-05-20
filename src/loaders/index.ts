import { Application } from "express";
import expressLoader from "./express";
import typeormLoader from "./typeorm";

export default ({ app }: { app: Application }) => {
    //typeormLoader();
    expressLoader({ app });
};