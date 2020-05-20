import { Router, Request, Response, NextFunction } from "express";
import { Container } from "typedi";
import { ChatbotService } from "../../services/chatbot";
import { IChatbotDTO } from "../../interfaces/IChatbot";
import middlewares from "../middlewares";

export default ({ router }: { router: Router }) => {
    router.post("/", middlewares.checkExistChatbot, async (req: Request, res: Response, next: NextFunction) => {
        try {
            const chatbotServiceInstance = Container.get(ChatbotService);
            
            const { id, name, role } = await chatbotServiceInstance.createChatbot(req.body as IChatbotDTO);
            return res.status(201).json({ id, name, role });
        } catch (err) {
            console.error(err);
            return next(err);
        }
    });
}