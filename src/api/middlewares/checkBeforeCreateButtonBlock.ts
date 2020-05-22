import { Container } from "typedi";
import { getManager } from "typeorm";
import { Request, Response, NextFunction } from "express";

export async function checkBeforeCreateButtonBlock(req: Request, res: Response, next: NextFunction) {
    try {
        const { previous } = req.body;
        const entityManager = getManager();
        const buttonEntity: Entities.buttonEntity = Container.get("buttonEntity");
        const inputEntity: Entities.inputEntity = Container.get("inputEntity");
        
        const button = await entityManager.findOne(buttonEntity, previous);

        if (button) {
            return res.status(409).json({
                message: "This block already has button block"
            });
        }

        const input = await entityManager.findOne(inputEntity, previous);

        if (input) {
            return res.status(409).json({
                message: "This block has input block"
            });
        }

        return next();
    } catch (err) {
        console.error(err);
        return next(err);
    }
}