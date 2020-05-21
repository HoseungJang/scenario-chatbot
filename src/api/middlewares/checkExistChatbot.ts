import { Container } from "typedi";
import { getManager } from "typeorm";
import { Request, Response, NextFunction } from "express";

export async function checkExistChatbot(req: Request, res: Response, next: NextFunction) {
    try {
        const { name } = req.body;
        const entityManager = getManager();
        const chatbotEntity: Entities.chatbotEntity = Container.get("chatbotEntity");
        const chatbot = await entityManager.findOne(chatbotEntity, {
            where: { name }
        });

        if (chatbot) {
            return res.status(409).json({
                message: "This chatbot is aleady exist"
            });
        }

        return next();
    } catch (err) {
        console.error(err);
        return next(err);
    }
}