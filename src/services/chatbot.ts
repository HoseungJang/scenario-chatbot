import { Service, Inject } from "typedi";
import { getRepository } from "typeorm";
import { IChatbot, IChatbotDTO } from "../interfaces/IChatbot";

@Service()
export class ChatbotService {
    constructor(
        @Inject("chatbotEntity") private chatbotEntity: Entities.chatbotEntity
    ) { }

    public async createChatbot({ name, role }: IChatbotDTO): Promise<IChatbot> {
        try {
            const { insertId: id } = (await getRepository(this.chatbotEntity)
                .createQueryBuilder()
                .insert()
                .values({ name, role })
                .execute()).raw;

            return { id, name, role };
        } catch (err) {
            throw err;
        }
    }
}