import { Container } from "typedi";
import { Chatbot } from "../entities/chatbot";
import { Skill } from "../entities/skill";

export default () => {
    Container.set("chatbotEntity", Chatbot);

    Container.set("skillEntity", Skill);
};