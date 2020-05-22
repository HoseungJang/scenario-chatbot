import { Container } from "typedi";
import { getManager } from "typeorm";
import { Request, Response, NextFunction } from "express";

export async function checkBeforeCreateInputBlock(req: Request, res: Response, next: NextFunction) {
    try {
        const { previous } = req.body;
        const entityManager = getManager();
        const inputEntity: Entities.inputEntity = Container.get("inputEntity");
        const buttonEntity: Entities.buttonEntity = Container.get("buttonEntity");
        
        const input = await entityManager.findOne(inputEntity, {
            where: { previous }
        });

        if (input) {
            return res.status(409).json({
                message: "This block already has input block"
            });
        }

        
        const button = await entityManager.findOne(buttonEntity, {
            where: { previous }
        });

        if (button) {
            return res.status(409).json({
                message: "This block has button block"
            });
        }

        return next();
    } catch (err) {
        console.error(err);
        return next(err);
    }
}