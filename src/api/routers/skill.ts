import { Router, Request, Response, NextFunction } from "express";
import { Container } from "typedi";
import { SkillService } from "../../services/skill";
import { IBlock, IBlockDTO } from "../../interfaces/IBlock";
import middlewares from "../middlewares";

const router: Router = Router();

export default ({ app }: { app: Router }) => {
    app.use("/skill", router);

    router.post("/:id/block", middlewares.checkBeforeCreateBlock, async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { name } = req.body;
            const skillId = Number(req.params.id);
            const skillServiceInstance = Container.get(SkillService);
            const result: IBlock = await skillServiceInstance.createBlock({ name, skillId } as IBlockDTO);
    
            return res.status(201).json({ result });
        } catch (err) {
            console.error(err);
            return next(err);
        }
    });
}