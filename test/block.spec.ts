import { expect } from "chai";
import { Container } from "typedi";
import { useContainer, createConnection, getManager, getConnection } from "typeorm";
import { IMessage, IMessageDTO } from "../src/interfaces/IMessage";
import { BlockService } from "../src/services/block";
import { Block } from "../src/entities/block";
import { Message } from "../src/entities/message";

describe("BlockService", async () => {
    before(async () => {
        useContainer(Container);
        await createConnection();
        Container.set("blockEntity", Block);
        Container.set("messageEntity", Message);
    });

    after(() => {
        getConnection().close();
    });

    it("createMessage", async () => {
        const entityManager = getManager();
        const blockServiceInstance = Container.get(BlockService);
        const images = [{
            path: "src\\uploads\\asdfasdf.png"
        }] as Express.Multer.File[];
        const messages = [{
            type: "text",
            data: "안녕?",
            slot: false
        }, {
            type: "image",
            data: 0,
            slot: false
        }];
        const blockId = -1;
        const result: IMessage[] = await blockServiceInstance.createMessage({ images, messages, blockId } as IMessageDTO);

        expect(result[0]).to.have.all.keys("id", "type", "data", "slot");

        for (const { id } of result) {
            const message = await entityManager.findOne(Message, id);

            await entityManager.remove(message);
        }
    });
})