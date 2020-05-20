import { Router } from "express";
import chatbot from "./routers/chatbot";

export default () => {
    const router: Router = Router();
    
    chatbot({ router });
    return router;
};