import { Router } from "express";
import chatbot from "./routers/chatbot";
import skill from "./routers/skill";
import block from "./routers/block";

export default () => {
    const app: Router = Router();
    
    chatbot({ app });
    skill({ app });
    block({ app });
    
    return app;
}