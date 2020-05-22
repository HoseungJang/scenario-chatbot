import { Router, Request, Response, NextFunction } from "express";
import { Container } from "typedi";
import { BlockService } from "../../services/block";
import { IMessage, IMessageDTO } from "../../interfaces/IMessage";
import upload from "../../config/multer";
import middlewares from "../middlewares";

const router: Router = Router();

export default ({ app }: { app: Router }) => {
    app.use("/block", router);

    router.post("/:id/message", upload.array("images"), async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { messages } = req.body;
            const images = req.files as Express.Multer.File[];
            const blockId = Number(req.params.id);
            const blockServiceInstance = Container.get(BlockService);
            const result: IMessage[] = await blockServiceInstance.createMessage({ images, messages, blockId } as IMessageDTO);

            return res.status(201).json({ result });
        } catch (err) {
            console.error(err);
            return next(err);
        }
    })
}