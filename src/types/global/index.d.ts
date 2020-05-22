import { EntityManager } from "typeorm";
import { Chatbot } from "../../entities/chatbot";
import { Skill } from "../../entities/skill";
import { Block } from "../../entities/block";
import { Message } from "../../entities/message";
import { Input } from "../../entities/input";

declare global {
    namespace Entities {
        export type manager = EntityManager;
        export type chatbotEntity = typeof Chatbot;
        export type skillEntity = typeof Skill;
        export type blockEntity = typeof Block;
        export type messageEntity = typeof Message;
        export type inputEntity = typeof Input;
    }
}