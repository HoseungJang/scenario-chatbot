import { Container } from "typedi";
import { Chatbot } from "../entities/chatbot";
import { Skill } from "../entities/skill";
import { Block } from "../entities/block";
import { Message } from "../entities/message";

export default () => {
    Container.set("chatbotEntity", Chatbot);

    Container.set("skillEntity", Skill);

    Container.set("blockEntity", Block);

    Container.set("messageEntity", Message);
}