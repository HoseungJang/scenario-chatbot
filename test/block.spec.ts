import { expect } from "chai";
import { Container } from "typedi";
import { useContainer, createConnection, getManager, getConnection, In } from "typeorm";
import { IMessage, IMessageDTO } from "../src/interfaces/IMessage";
import { IInput, IInputDTO } from "../src/interfaces/IInput";
import { IButton, IButtonDTO } from "../src/interfaces/IButton";
import { BlockService } from "../src/services/block";
import { Block } from "../src/entities/block";
import { Message } from "../src/entities/message";
import { Input } from "../src/entities/input";
import { Button } from "../src/entities/button";
import * as dotenv from "dotenv";
import { IBlockInfo } from "../src/interfaces/IBlock";
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

    it("getBlockInfo", async () => {
        const entityManager = getManager();
        const blockServiceInstance = Container.get(BlockService);
        const block1 = new Block();
        const block2 = new Block();
        const block3 = new Block();
        const message1 = new Message();
        const message2 = new Message();
        const message3 = new Message();
        const message4 = new Message();
        const input = new Input();
        const button1 = new Button();
        const button2 = new Button();

        block1.name = "테스트블록1";
        await entityManager.save(block1);

        block2.name = "테스트블록2";
        await entityManager.save(block2);

        block3.name = "테스트블록3";
        await entityManager.save(block3);

        message1.type = "text";
        message1.data = "너의 이름은 뭐니?";
        message1.block = block1;
        message1.slot = false;
        await entityManager.save(message1);

        message2.type = "text";
        message2.data = "멋진 이름이다. ${name}!";
        message2.block = block2;
        message2.slot = true;
        await entityManager.save(message2);

        message3.type = "image";
        message3.data = "/src/uploads/asdf.png";
        message3.block = block3;
        message3.slot = false;
        await entityManager.save(message3);

        message4.type = "text";
        message4.data = "그럼 잘있어 ${name}!";
        message4.block = block3;
        message4.slot = true;
        await entityManager.save(message4);

        input.leftText = "내 이름은";
        input.rightText = "이야.";
        input.variableName = "name";
        input.previous = block1;
        input.jumpTo = block2;
        await entityManager.save(input);

        button1.data = "그런가..";
        button1.previous = block2;
        button1.jumpTo = block3;
        await entityManager.save(button1);

        button2.data = "고마워!";
        button2.previous = block2;
        button2.jumpTo = block3;
        await entityManager.save(button2);

        const result1: IBlockInfo = await blockServiceInstance.getBlockInfo({ blockId: block1.id, variables: [] });
        
        expect(result1).to.have.all.keys("messages", "next");
        expect(result1.messages[0].type).to.equal(message1.type);
        expect(result1.messages[0].data).to.equal(message1.data);
        expect(result1.next).to.equal("input");

        const result2: IBlockInfo = await blockServiceInstance.getBlockInfo({ blockId: block2.id, variables: [{ name: "name", data: "홍길동" }] });

        expect(result2).to.have.all.keys("messages", "next");
        expect(result2.messages[0].type).to.equal(message1.type);
        expect(result2.messages[0].data).to.equal("멋진 이름이다. 홍길동!");
        expect(result2.next).to.equal("button");

        const result3: IBlockInfo = await blockServiceInstance.getBlockInfo({ blockId: block3.id, variables: [{ name: "name", data: "홍길동" }] });

        expect(result3).to.have.all.keys("messages", "next");
        expect(result3.messages[0].type).to.equal(message3.type);
        expect(result3.messages[0].data).to.equal(message3.data);
        expect(result3.messages[1].type).to.equal(message4.type);
        expect(result3.messages[1].data).to.equal("그럼 잘있어 홍길동!");
        expect(result3.next).to.equal(null);

        await entityManager.remove(block1);
        await entityManager.remove(block2);
        await entityManager.remove(block3);
        await entityManager.remove(message1);
        await entityManager.remove(message2);
        await entityManager.remove(message3);
        await entityManager.remove(message4);
        await entityManager.remove(input);
        await entityManager.remove(button1);
        await entityManager.remove(button2);
    });

    it("getInputBlock", async () => {
        const entityManager = getManager();
        const blockServiceInstance = Container.get(BlockService);
        const block1 = new Block();
        const block2 = new Block();
        const input = new Input();

        block1.name = "테스트블록1";
        await entityManager.save(block1);

        block2.name = "테스트블록2";
        await entityManager.save(block2);

        input.leftText = "테스트";
        input.rightText = "테스트";
        input.variableName = "test";
        input.previous = block1;
        input.jumpTo = block2;
        await entityManager.save(input);

        const result: { leftText: string, rightText: string, variableName: string, jumpTo: number } = await blockServiceInstance.getInputBlock(block1.id);

        expect(result).to.have.all.keys("leftText", "rightText", "variableName", "jumpTo");
        expect(result.leftText).to.equal(input.leftText);
        expect(result.rightText).to.equal(input.rightText);
        expect(result.variableName).to.equal(input.variableName);
        expect(result.jumpTo).to.equal(input.jumpTo.id);

        await entityManager.remove(block1);
        await entityManager.remove(block2);
        await entityManager.remove(input);
    });

    it("getInputBlock", async () => {
        const entityManager = getManager();
        const blockServiceInstance = Container.get(BlockService);
        const block1 = new Block();
        const block2 = new Block();
        const button1 = new Button();
        const button2 = new Button();

        block1.name = "테스트블록1";
        await entityManager.save(block1);

        block2.name = "테스트블록2";
        await entityManager.save(block2);

        button1.data = "테스트버튼1";
        button1.previous = block1;
        button1.jumpTo = block2;
        await entityManager.save(button1);

        button2.data = "테스트버튼2";
        button2.previous = block1;
        button2.jumpTo = block2;
        await entityManager.save(button2);

        const result: { data: string, jumpTo: number }[] = await blockServiceInstance.getButtonBlock(block1.id);

        expect(result[0]).to.have.all.keys("data", "jumpTo");
        expect(result[0].data).to.equal(button1.data);
        expect(result[0].jumpTo).to.equal(button1.jumpTo.id);

        expect(result[1]).to.have.all.keys("data", "jumpTo");
        expect(result[1].data).to.equal(button2.data);
        expect(result[1].jumpTo).to.equal(button2.jumpTo.id);

        await entityManager.remove(block1);
        await entityManager.remove(block2);
        await entityManager.remove(button1);
        await entityManager.remove(button2);
    });
});