import { Service, Inject } from "typedi";
import { InjectManager } from "typeorm-typedi-extensions"
import { IMessage, IMessageDTO } from "../interfaces/IMessage";
import { IInput, IInputDTO } from "../interfaces/IInput";
import { IButton, IButtonDTO } from "../interfaces/IButton";

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
}