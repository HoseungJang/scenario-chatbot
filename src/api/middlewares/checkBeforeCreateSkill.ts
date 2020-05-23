import { Container } from "typedi";
import { getManager } from "typeorm";
import { Request, Response, NextFunction } from "express";

export async function checkBeforeCreateSkill(req: Request, res: Response, next: NextFunction) {
    try {
        const { name } = req.body;
        const chatbotId = Number(req.params.id);
        const entityManager = getManager();
        const chatbotEntity: Entities.chatbotEntity = Container.get("chatbotEntity");
        const skillEntity: Entities.skillEntity = Container.get("skillEntity");
        
        const chatbot = await entityManager.findOne(chatbotEntity, chatbotId);

        if (!chatbot) {
            return res.status(404).json({
                message: "This chatbot is not exist"
            });
        }

        const skill = await entityManager.findOne(skillEntity, {
            where: { name, chatbot: chatbotId }
        });

        if (skill) {
            return res.status(409).json({
                message: "This skill is aleady exist"
            });
        }

        return next();
    } catch (err) {
        console.error(err);
        return next(err);
    }
}