import { expect } from "chai";
import { Container } from "typedi";
import { useContainer, createConnection, getManager, getConnection } from "typeorm";
import { IMessage, IMessageDTO } from "../src/interfaces/IMessage";
import { IInput, IInputDTO } from "../src/interfaces/IInput";
import { IButton, IButtonDTO } from "../src/interfaces/IButton";
import { BlockService } from "../src/services/block";
import { Block } from "../src/entities/block";
import { Message } from "../src/entities/message";
import { Input } from "../src/entities/input";
import { Button } from "../src/entities/button";
import * as dotenv from "dotenv";
dotenv.config({ path: "test.env" });

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
                data: "테스트메시지",
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
        expect(result[0].type).to.equal("text");
        expect(result[0].data).to.equal("테스트메시지");
        expect(result[0].slot).to.equal(false);
        
        expect(result[1]).to.have.all.keys("id", "type", "data", "slot");
        expect(result[1].type).to.equal("image");
        expect(result[1].data).to.equal("/src/uploads/asdfasdf.png");
        expect(result[1].slot).to.equal(false);

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
        expect(result.leftText).to.equal(inputDTO.leftText);
        expect(result.rightText).to.equal(inputDTO.rightText);
        expect(result.variableName).to.equal(inputDTO.variableName);
        expect(result.previous).to.equal(inputDTO.previous);
        expect(result.jumpTo).to.equal(inputDTO.jumpTo);

        const { id } = result;
        const input = await entityManager.findOne(Input, id);

        await entityManager.remove(input);
    });

    it("createButtonBlock", async () => {
        const entityManager = getManager();
        const blockServiceInstance = Container.get(BlockService);
        const buttonDTO: IButtonDTO = {
            buttons: [
                { data: "테스트1", jumpTo: -1 },
                { data: "테스트2", jumpTo: -1 },
            ],
            blockId: -1
        };
        const result: IButton[] = await blockServiceInstance.createButtonBlock(buttonDTO);

        expect(result[0]).to.have.all.keys("id", "data", "previous", "jumpTo");
        expect(result[0].data).to.equal(buttonDTO.buttons[0].data);
        expect(result[0].previous).to.equal(buttonDTO.blockId);
        expect(result[0].jumpTo).to.equal(buttonDTO.buttons[0].jumpTo);

        expect(result[1]).to.have.all.keys("id", "data", "previous", "jumpTo");
        expect(result[1].data).to.equal(buttonDTO.buttons[1].data);
        expect(result[1].previous).to.equal(buttonDTO.blockId);
        expect(result[1].jumpTo).to.equal(buttonDTO.buttons[1].jumpTo);

        for (const { id } of result) {
            const button = await entityManager.findOne(Button, id);

            await entityManager.remove(button);
        }
    });
});