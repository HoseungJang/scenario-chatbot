import { Container } from "typedi";
import { getManager } from "typeorm";
import { Request, Response, NextFunction } from "express";

export async function checkBeforeGetButtonBlock(req: Request, res: Response, next: NextFunction) {
    try {
        const id = Number(req.params.id);
        const entityManager = getManager();
        const blockEntity: Entities.blockEntity = Container.get("blockEntity");
        
        const block = await entityManager.findOne(blockEntity, {
            where: { id }
        });

        if (!block) {
            return res.status(404).json({
                message: "This block is not exist"
            });
        }

        return next();
    } catch (err) {
        console.error(err);
        return next(err);
    }
}