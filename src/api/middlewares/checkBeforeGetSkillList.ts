import { Container } from "typedi";
import { getManager } from "typeorm";
import { Request, Response, NextFunction } from "express";

export async function checkBeforeGetSkillList(req: Request, res: Response, next: NextFunction) {
    try {
        const chatbotId = Number(req.params.id);
        const entityManager = getManager();
        const chatbotEntity: Entities.chatbotEntity = Container.get("chatbotEntity");
        
        const chatbot = await entityManager.findOne(chatbotEntity, chatbotId);

        if (!chatbot) {
            return res.status(404).json({
                message: "This chatbot is not exist"
            });
        }

        return next();
    } catch (err) {
        console.error(err);
        return next(err);
    }
}