import { expect } from "chai";
import { Container } from "typedi";
import { useContainer, createConnection, getManager, getConnection } from "typeorm";
import { IMessage, IMessageDTO } from "../src/interfaces/IMessage";
import { IInput, IInputDTO } from "../src/interfaces/IInput";
import { BlockService } from "../src/services/block";
import { Block } from "../src/entities/block";
import { Message } from "../src/entities/message";
import { Input } from "../src/entities/input";
import { Button } from "../src/entities/button";

describe("BlockService", async () => {
    before(async () => {
        useContainer(Container);
        await createConnection();
        Container.set("blockEntity", Block);
        Container.set("messageEntity", Message);
        Container.set("inputEntity", Input);
        Container.set("buttonEntity", Button);
    });

    after(() => {
        getConnection().close();
    });

    it("createMessage", async () => {
        const entityManager = getManager();
        const blockServiceInstance = Container.get(BlockService);
        const messageDTO: IMessageDTO = {
            images: [{
                path: "src\\uploads\\asdfasdf.png"
            }] as Express.Multer.File[],
            messages: [{
                type: "text",
                data: "안녕?",
                slot: false
            }, {
                type: "image",
                data: 0,
                slot: false
            }],
            blockId: -1
        };
        const result: IMessage[] = await blockServiceInstance.createMessage(messageDTO);

        expect(result[0]).to.have.all.keys("id", "type", "data", "slot");

        for (const { id } of result) {
            const message = await entityManager.findOne(Message, id);

            await entityManager.remove(message);
        }
    });

    it("createInputBlock", async () => {
        const entityManager = getManager();
        const blockServiceInstance = Container.get(BlockService);
        const inputDTO: IInputDTO = {
            leftText: "테스트",
            rightText: "테스트",
            variableName: "test",
            previous: -1,
            jumpTo: -1
        };
        const result: IInput = await blockServiceInstance.createInputBlock(inputDTO);

        expect(result).to.have.all.keys("id", "leftText", "rightText", "variableName", "previous", "jumpTo");

        const { id } = result;
        const input = await entityManager.findOne(Input, id);

        await entityManager.remove(input);
    });
});