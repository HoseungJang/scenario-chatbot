import { Router, Request, Response, NextFunction } from "express";
import { Container } from "typedi";
import { BlockService } from "../../services/block";
import { IMessage, IMessageDTO } from "../../interfaces/IMessage";
import upload from "../../config/multer";
import middlewares from "../middlewares";
import { IInput, IInputDTO } from "../../interfaces/IInput";
import { IButton, IButtonDTO } from "../../interfaces/IButton";
import { IBlockInfo } from "../../interfaces/IBlock";

const router: Router = Router();

export default ({ app }: { app: Router }) => {
    app.use("/block", router);

    router.get("/:id/info", middlewares.checkBeforeGetBlockInfo, async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { variables } = req.body;
            const blockId = Number(req.params.id);
            const blockServiceInstance = Container.get(BlockService);
            const result: IBlockInfo = await blockServiceInstance.getBlockInfo({ blockId, variables });

            return res.status(200).json({ result });
        } catch (err) {
            console.error(err);
            return next(err);
        }
    });

    router.post("/:id/message", middlewares.checkBeforeCreateMessage, upload.array("images"), async (req: Request, res: Response, next: NextFunction) => {
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
    });

    router.post("/input", middlewares.checkBeforeCreateInputBlock, async (req: Request, res: Response, next: NextFunction) => {
        try {
            const blockServiceInstance = Container.get(BlockService);
            const result: IInput = await blockServiceInstance.createInputBlock(req.body as IInputDTO);

            return res.status(201).json({ result });
        } catch (err) {
            console.error(err);
            return next(err);
        }
    });

    router.get("/:id/input", middlewares.checkBeforeGetInputBlock, async (req: Request, res: Response, next: NextFunction) => {
        try {
            const blockId = Number(req.params.id);
            const blockServiceInstance = Container.get(BlockService);
            const result: { leftText: string, rightText: string, variableName: string, jumpTo: number } = await blockServiceInstance.getInputBlock(blockId);

            return res.status(200).json({ result });
        } catch (err) {
            console.error(err);
            return next(err);
        }
    });

    router.post("/button", middlewares.checkBeforeCreateButtonBlock, async (req: Request, res: Response, next: NextFunction) => {
        try {
            const blockServiceInstance = Container.get(BlockService);
            const result: IButton[] = await blockServiceInstance.createButtonBlock(req.body as IButtonDTO);

            return res.status(201).json({ result });
        } catch (err) {
            console.error(err);
            return next(err);
        }
    });

    router.get("/:id/button", middlewares.checkBeforeGetButtonBlock, async (req: Request, res: Response, next: NextFunction) => {
        try {
            const blockId = Number(req.params.id);
            const blockServiceInstance = Container.get(BlockService);
            const result: { data: string, jumpTo: number }[] = await blockServiceInstance.getButtonBlock(blockId);

            return res.status(200).json({ result });
        } catch (err) {
            console.error(err);
            return next(err);
        }
    });
}