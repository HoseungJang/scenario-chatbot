import { Router, Request, Response, NextFunction } from "express";
import { Container } from "typedi";
import { ChatbotService } from "../../services/chatbot";
import { IChatbot, IChatbotDTO } from "../../interfaces/IChatbot";
import { ISkill, ISkillDTO } from "../../interfaces/ISkill";
import middlewares from "../middlewares";

const router: Router = Router();

export default ({ app }: { app: Router }) => {
    app.use("/chatbot", router);

    router.post("/", middlewares.checkBeforeCreateChatbot, async (req: Request, res: Response, next: NextFunction) => {
        try {
            const chatbotServiceInstance = Container.get(ChatbotService);
            const result: IChatbot = await chatbotServiceInstance.createChatbot(req.body as IChatbotDTO);

            return res.status(201).json({ result });
        } catch (err) {
            console.error(err);
            return next(err);
        }
    });

    router.post("/:id/skill", middlewares.checkBeforeCreateSkill, async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { name } = req.body;
            const chatbotId = Number(req.params.id);
            const chatbotServiceInstance = Container.get(ChatbotService);
            const result: ISkill = await chatbotServiceInstance.createSkill({ name, chatbotId } as ISkillDTO);
            
            return res.status(201).json({ result });
        } catch (err) {
            console.error(err);
            return next(err);
        }
    });
};