import { Container } from "typedi";
import { getManager } from "typeorm";
import { Request, Response, NextFunction } from "express";

export async function checkBeforeCreateButtonBlock(req: Request, res: Response, next: NextFunction) {
    try {
        const { buttons, blockId } = req.body;
        const entityManager = getManager();
        const blockEntity: Entities.blockEntity = Container.get("blockEntity");
        const buttonEntity: Entities.buttonEntity = Container.get("buttonEntity");
        const inputEntity: Entities.inputEntity = Container.get("inputEntity");

        const previousBlock = await entityManager.findOne(blockEntity, {
            where: { id: blockId }
        });

        if (!previousBlock) {
            return res.status(404).json({
                message: "Previous block is not exist"
            });
        }
        
        const button = await entityManager.findOne(buttonEntity, {
            where: { previous: blockId }
        });

        if (button) {
            return res.status(409).json({
                message: "This block already has button blocks"
            });
        }

        const input = await entityManager.findOne(inputEntity, {
            where: { previous: blockId }
        });

        if (input) {
            return res.status(409).json({
                message: "This block has input block"
            });
        }

        for (const { jumpTo } of buttons) {
            const jumpToBlock = await entityManager.findOne(blockEntity, {
                where: { id: jumpTo }
            });
    
            if (!jumpToBlock) {
                return res.status(404).json({
                    message: "jumpTo block is not exist"
                });
            }
        }

        return next();
    } catch (err) {
        console.error(err);
        return next(err);
    }
}