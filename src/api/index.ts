import { Router } from "express";
import chatbot from "./routers/chatbot";

export default () => {
    const app: Router = Router();
    
    chatbot({ app });
    
    return app;
};