import { Container } from "typedi";
import { getManager } from "typeorm";
import { Request, Response, NextFunction } from "express";

export async function checkBeforeGetStartBlock(req: Request, res: Response, next: NextFunction) {
    try {
        const skillId = Number(req.params.id);
        const entityManager = getManager();
        const skillEntity: Entities.skillEntity = Container.get("skillEntity");

        const skill = await entityManager.findOne(skillEntity, skillId);

        if (!skill) {
            return res.status(404).json({
                message: "This skill is not exist"
            });
        }

        return next();
    } catch (err) {
        console.error(err);
        return next(err);
    }
}