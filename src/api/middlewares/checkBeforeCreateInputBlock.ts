import { Container } from "typedi";
import { getManager } from "typeorm";
import { Request, Response, NextFunction } from "express";

export async function checkBeforeCreateInputBlock(req: Request, res: Response, next: NextFunction) {
    try {
        const { previous, jumpTo } = req.body;
        const entityManager = getManager();
        const blockEntity: Entities.blockEntity = Container.get("blockEntity");
        const inputEntity: Entities.inputEntity = Container.get("inputEntity");
        const buttonEntity: Entities.buttonEntity = Container.get("buttonEntity");
        
        const previousBlock = await entityManager.findOne(blockEntity, {
            where: { id: previous }
        });

        if (!previousBlock) {
            return res.status(404).json({
                message: "Previous block is not exist"
            });
        }

        const jumpToBlock = await entityManager.findOne(blockEntity, {
            where: { id: jumpTo }
        });

        if (!jumpToBlock) {
            return res.status(404).json({
                message: "jumpTo block is not exist"
            });
        }

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
                message: "This block has button blocks"
            });
        }

        return next();
    } catch (err) {
        console.error(err);
        return next(err);
    }
}