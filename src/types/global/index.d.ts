import { Chatbot } from "../../entities/chatbot";
import { Skill } from "../../entities/skill";

declare global {
    namespace Entities {
        export type chatbotEntity = typeof Chatbot;
        export type skillEntity = typeof Skill;
    }
}