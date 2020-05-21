import { Service, Inject } from "typedi";
import { getManager } from "typeorm";
import { IChatbot, IChatbotDTO } from "../interfaces/IChatbot";
import { ISkill, ISkillDTO } from "../interfaces/ISkill";

@Service()
export class ChatbotService {
    constructor(
        @Inject("chatbotEntity") private chatbotEntity: Entities.chatbotEntity,
        @Inject("skillEntity") private skillEntity: Entities.skillEntity
    ) { }

    public async createChatbot({ name, role }: IChatbotDTO): Promise<IChatbot> {
        try {
            const entityManager = getManager();
            const chatbot = new this.chatbotEntity();

            chatbot.name = name;
            chatbot.role = role;
            await entityManager.save(chatbot);

            const { id } = chatbot;

            return { id, name, role };
        } catch (err) {
            throw err;
        }
    }

    public async createSkill({ name, chatbotId }: ISkillDTO): Promise<ISkill> {
        try {
            const entityManager = getManager();
            const chatbot = await entityManager.findOne(this.chatbotEntity, chatbotId);
            const skill = new this.skillEntity();
            
            skill.name = name;
            skill.chatbot = chatbot;
            await entityManager.save(skill);

            const { id } = skill;

            return { id, name };
        } catch (err) {
            throw err;
        }
    }
}