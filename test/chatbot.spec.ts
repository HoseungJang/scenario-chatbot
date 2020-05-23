import { expect } from "chai";
import { Container } from "typedi";
import { useContainer, createConnection, getManager, getConnection } from "typeorm";
import { IChatbot, IChatbotDTO } from "../src/interfaces/IChatbot";
import { ISkill, ISkillDTO } from "../src/interfaces/ISkill";
import { ChatbotService } from "../src/services/chatbot";
import { Chatbot } from "../src/entities/chatbot";
import { Skill } from "../src/entities/skill";
import { Block } from "../src/entities/block";
import * as dotenv from "dotenv";
dotenv.config({ path: "test.env" });

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
        const chatbotDTO: IChatbotDTO = {
            name: "테스트",
            role: "테스트용"
        };
        const result: IChatbot = await chatbotServiceInstance.createChatbot(chatbotDTO);

        expect(result).to.have.all.keys("id", "name", "role");
        expect(result.name).to.equal(chatbotDTO.name);
        expect(result.role).to.equal(chatbotDTO.role);

        const { id } = result;
        const chatbot = await entityManager.findOne(Chatbot, id);

        await entityManager.remove(chatbot);
    });

    it("getChatbotList", async () => {
        const entityManager = getManager();
        const chatbotServiceInstance = Container.get(ChatbotService);
        const chatbot1 = new Chatbot();
        const chatbot2 = new Chatbot();

        chatbot1.name = "테스트챗봇1";
        chatbot1.role = "테스트";
        await entityManager.save(chatbot1);

        chatbot2.name = "테스트챗봇2";
        chatbot2.role = "테스트";
        await entityManager.save(chatbot2);

        const result: IChatbot[] = await chatbotServiceInstance.getChatbotList();

        expect(result[0]).to.have.all.keys("id", "name", "role");
        expect(result[0].name).to.equal(chatbot1.name);
        expect(result[0].role).to.equal(chatbot1.role);

        expect(result[1]).to.have.all.keys("id", "name", "role");
        expect(result[1].name).to.equal(chatbot2.name);
        expect(result[1].role).to.equal(chatbot2.role);

        await entityManager.remove(chatbot1);
        await entityManager.remove(chatbot2);
    });

    it("createSkill", async () => {
        const entityManager = getManager();
        const chatbotServiceInstance = Container.get(ChatbotService);
        const skillDTO: ISkillDTO = {
            name: "테스트스킬",
            chatbotId: -1
        }
        const result: ISkill = await chatbotServiceInstance.createSkill(skillDTO);

        expect(result).to.have.all.keys("id", "name");
        expect(result.name).to.equal(skillDTO.name);

        const { id } = result;
        const skill = await entityManager.findOne(Skill, id);

        await entityManager.remove(skill);
    });

    it("getSkillList", async () => {
        const entityManager = getManager();
        const chatbotServiceInstance = Container.get(ChatbotService);
        const chatbot = new Chatbot();
        const skill1 = new Skill();
        const skill2 = new Skill();

        chatbot.name = "테스트챗봇1";
        chatbot.role = "테스트";
        await entityManager.save(chatbot);

        skill1.name = "테스트스킬1";
        skill1.chatbot = chatbot;
        await entityManager.save(skill1);

        skill2.name = "테스트스킬2";
        skill2.chatbot = chatbot;
        await entityManager.save(skill2);
        
        const result: ISkill[] = await chatbotServiceInstance.getSkillList(chatbot.id);

        expect(result[0]).to.have.all.keys("id", "name");
        expect(result[0].name).to.equal(skill1.name);

        expect(result[1]).to.have.all.keys("id", "name");
        expect(result[1].name).to.equal(skill2.name);

        await entityManager.remove(chatbot);
        await entityManager.remove(skill1);
        await entityManager.remove(skill2);
    });
});