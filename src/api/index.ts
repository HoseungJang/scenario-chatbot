import { Router } from "express";
import chatbot from "./routers/chatbot";
import skill from "./routers/skill";

export default () => {
    const app: Router = Router();
    
    chatbot({ app });
    skill({ app });
    
    return app;
}