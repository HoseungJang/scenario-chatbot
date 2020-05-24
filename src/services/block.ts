import { Service, Inject } from "typedi";
import { InjectManager } from "typeorm-typedi-extensions"
import { IMessage, IMessageDTO } from "../interfaces/IMessage";
import { IInput, IInputDTO } from "../interfaces/IInput";
import { IButton, IButtonDTO } from "../interfaces/IButton";
import { IBlockInfo, IBlockInfoDTO } from "../interfaces/IBlock";

@Service()
export class BlockService {
    constructor(
        @InjectManager() private entityManager: Entities.manager,
        @Inject("blockEntity") private blockEntity: Entities.blockEntity,
        @Inject("messageEntity") private messageEntity: Entities.messageEntity,
        @Inject("inputEntity") private inputEntity: Entities.inputEntity,
        @Inject("buttonEntity") private buttonEntity: Entities.buttonEntity
    ) { }

    public async createMessage({ images, messages, blockId }: IMessageDTO): Promise<IMessage[]> {
        try {
            const block = await this.entityManager.findOne(this.blockEntity, blockId);
            const result: IMessage[] = [];

            for (const e of messages) {
                const message = new this.messageEntity();

                message.type = e.type;
                message.slot = e.slot;
                message.block = block;
                message.data = e.type === "text" ? e.data as string : `/${images[e.data].path.split("\\").join("/")}` as string;
                await this.entityManager.save(message);

                const { id, type, data, slot } = message;

                result.push({ id, type, data, slot } as IMessage);
            }

            return result;
        } catch (err) {
            throw err;
        }
    }

    public async createInputBlock({ leftText, rightText, variableName, previous, jumpTo }: IInputDTO): Promise<IInput> {
        try {
            const previousBlock = await this.entityManager.findOne(this.blockEntity, previous);
            const jumpToBlock = await this.entityManager.findOne(this.blockEntity, jumpTo);
            const input = new this.inputEntity();

            input.leftText = leftText;
            input.rightText = rightText;
            input.variableName = variableName;
            input.previous = previousBlock;
            input.jumpTo = jumpToBlock;
            await this.entityManager.save(input);

            const { id } = input;

            return { id, leftText, rightText, variableName, previous, jumpTo };
        } catch (err) {
            throw err;
        }
    }

    public async createButtonBlock({ buttons, blockId: previous }: IButtonDTO): Promise<IButton[]> {
        try {
            const previousBlock = await this.entityManager.findOne(this.blockEntity, previous);
            const result: IButton[] = [];
    
            for (const { data, jumpTo } of buttons) {
                const jumpToBlock = await this.entityManager.findOne(this.blockEntity, jumpTo);
                const button = new this.buttonEntity();
    
                button.data = data;
                button.previous = previousBlock;
                button.jumpTo = jumpToBlock;
                await this.entityManager.save(button);
    
                const { id } = button;
    
                result.push({ id, data, previous, jumpTo });
            }
    
            return result;
        } catch (err) {
            throw err;
        }
    }

    public async getBlockInfo({ blockId, variables }: IBlockInfoDTO): Promise<IBlockInfo> {
        try{
            const messages = await this.entityManager.find(this.messageEntity, {
                where: { block: blockId },
                order: { id: "ASC" }
            });
            const input = await this.entityManager.findOne(this.inputEntity, {
                where: { previous: blockId }
            });
            const button = await this.entityManager.findOne(this.buttonEntity, {
                where: { previous: blockId }
            });
            const result: IBlockInfo = {
                messages: messages.map(e => {
                    if (e.slot) {
                        variables.map(({ name, data }) => {
                            e.data = e.data.split("${" + name + "}").join(data);
                        });
                    }
                    return {
                        type: e.type as "text" | "image",
                        data: e.data
                    };
                }),
                next: input ? "input" : button ? "button" : null
            };
    
            return result;
        } catch (err) {
            throw err;
        }
    }

    public async getInputBlock(blockId: number): Promise<{ leftText: string, rightText: string, variableName: string, jumpTo: number }> {
        try {
            const input = await this.entityManager.findOne(this.inputEntity, {
                where: { previous: blockId },
                relations: ["jumpTo"]
            });
            const { leftText, rightText, variableName } = input;
            const jumpTo = input.jumpTo.id;

            return { leftText, rightText, variableName, jumpTo };
        } catch (err) {
            throw err;
        }
    }

    public async getButtonBlock(blockId: number): Promise<{ data: string, jumpTo: number }[]> {
        try {
            const buttons = await this.entityManager.find(this.buttonEntity, {
                where: { previous: blockId },
                relations: ["jumpTo"]
            });
            const result: { data: string, jumpTo: number }[] = [];

            for (const button of buttons) {
                result.push({
                    data: button.data,
                    jumpTo: button.jumpTo.id
                });
            }

            return result;
        } catch (err) {
            throw err;
        }
    }
}