import { Chatbot } from "../../entities/chatbot";
import { Skill } from "../../entities/skill";
import { Block } from "../../entities/block";

declare global {
    namespace Entities {
        export type chatbotEntity = typeof Chatbot;
        export type skillEntity = typeof Skill;
        export type blockEntity = typeof Block;
    }
}