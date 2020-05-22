import { Service, Inject } from "typedi";
import { InjectManager } from "typeorm-typedi-extensions"
import { IMessage, IMessageDTO } from "../interfaces/IMessage";

@Service()
export class BlockService {
    constructor(
        @InjectManager() private entityManager: Entities.manager,
        @Inject("blockEntity") private blockEntity: Entities.blockEntity,
        @Inject("messageEntity") private messageEntity: Entities.messageEntity
    ) { }

    public async createMessage({ images, messages, blockId }: IMessageDTO): Promise<IMessage[]> {
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
    }
}