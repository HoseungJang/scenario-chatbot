import { expect } from "chai";
import { Container } from "typedi";
import { useContainer, createConnection, getManager, getConnection } from "typeorm";
import { IChatbot, IChatbotDTO } from "../src/interfaces/IChatbot";
import { ChatbotService } from "../src/services/chatbot";
import { Chatbot } from "../src/entities/chatbot";
import { Skill } from "../src/entities/skill";
import { Block } from "../src/entities/block";

describe("ChatbotService", async () => {
    before(async () => {
        useContainer(Container);
        await createConnection();
        Container.set("chatbotEntity", Chatbot);
        Container.set("skillEntity", Skill);
        Container.set("blockEntity", Block);
    });

    after(() => {
        getConnection().close();
    });

    it("createChatbot", async () => {
        const entityManager = getManager();
        const chatbotServiceInstance = Container.get(ChatbotService);
        const name = "테스트";
        const role = "테스트용";
        const result: IChatbot = await chatbotServiceInstance.createChatbot({ name, role } as IChatbotDTO);

        expect(result).to.have.all.keys("id", "name", "role");

        const { id } = result;
        const chatbot = await entityManager.findOne(Chatbot, id);

        await entityManager.remove(chatbot);
    });
})