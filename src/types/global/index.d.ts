import { Chatbot } from "../../entities/chatbot";

declare global {
    namespace Entities {
        export type chatbotEntity = typeof Chatbot;
    }
}