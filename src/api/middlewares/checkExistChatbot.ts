import { Container } from "typedi";
import { getRepository } from "typeorm";
import { Request, Response, NextFunction } from "express";

export async function checkExistChatbot(req: Request, res: Response, next: NextFunction) {
    try {
        const chatbotEntity: Entities.chatbotEntity = Container.get("chatbotEntity");
        const { name } = req.body;
        const isExist = await getRepository(chatbotEntity)
        .createQueryBuilder("chatbot")
        .where("chatbot.name = :name", { name })
        .getRawOne();

        if (isExist) {
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