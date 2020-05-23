import { Service, Inject } from "typedi";
import { InjectManager } from "typeorm-typedi-extensions";
import { IChatbot, IChatbotDTO } from "../interfaces/IChatbot";
import { ISkill, ISkillDTO } from "../interfaces/ISkill";

@Service()
export class ChatbotService {
    constructor(
        @InjectManager() private entityManager: Entities.manager,
        @Inject("chatbotEntity") private chatbotEntity: Entities.chatbotEntity,
        @Inject("skillEntity") private skillEntity: Entities.skillEntity,
        @Inject("blockEntity") private blockEntity: Entities.blockEntity
    ) { }

    public async createChatbot({ name, role }: IChatbotDTO): Promise<IChatbot> {
        try {
            const chatbot = new this.chatbotEntity();

            chatbot.name = name;
            chatbot.role = role;
            await this.entityManager.save(chatbot);

            const { id } = chatbot;

            return { id, name, role };
        } catch (err) {
            throw err;
        }
    }

    public async getChatbotList(): Promise<IChatbot[]> {
        try {
            const result: IChatbot[] = await this.entityManager.find(this.chatbotEntity);
    
            return result;
        } catch (err) {
            throw err;
        }
    }

    public async createSkill({ name, chatbotId }: ISkillDTO): Promise<ISkill> {
        try {
            const chatbot = await this.entityManager.findOne(this.chatbotEntity, chatbotId);
            const skill = new this.skillEntity();
            const block = new this.blockEntity();
            
            skill.name = name;
            skill.chatbot = chatbot;
            await this.entityManager.save(skill);

            block.name = "시작";
            block.skill = skill;
            await this.entityManager.save(block);

            const { id } = skill;

            return { id, name };
        } catch (err) {
            throw err;
        }
    }

    public async getSkillList(chatbot: number): Promise<ISkill[]> {
        try {
            const result: ISkill[] = await this.entityManager.find(this.skillEntity, {
                where: { chatbot }
            });

            return result;
        } catch (err) {
            throw err;
        }
    }
}