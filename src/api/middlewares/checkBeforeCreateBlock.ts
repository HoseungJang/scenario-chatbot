import { Container } from "typedi";
import { getManager } from "typeorm";
import { Request, Response, NextFunction } from "express";

export async function checkBeforeCreateBlock(req: Request, res: Response, next: NextFunction) {
    try {
        const { name } = req.body;
        const skillId = Number(req.params.id);
        const entityManager = getManager();
        const skillEntity: Entities.skillEntity = Container.get("skillEntity");
        const blockEntity: Entities.blockEntity = Container.get("blockEntity");

        const skill = await entityManager.findOne(skillEntity, skillId);

        if (!skill) {
            return res.status(404).json({
                message: "This skill is not exist"
            });
        }

        const block = await entityManager.findOne(blockEntity, {
            where: { name, skillId }
        });

        if (block) {
            return res.status(409).json({
                message: "This block is aleady exist"
            });
        }

        return next();
    } catch (err) {
        console.error(err);
        return next(err);
    }
}