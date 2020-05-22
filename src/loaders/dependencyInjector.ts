import { Container } from "typedi";
import { Chatbot } from "../entities/chatbot";
import { Skill } from "../entities/skill";
import { Block } from "../entities/block";
import { Message } from "../entities/message";
import { Input } from "../entities/input";
import { Button } from "../entities/button";

export default () => {
    Container.set("chatbotEntity", Chatbot);

    Container.set("skillEntity", Skill);

    Container.set("blockEntity", Block);

    Container.set("messageEntity", Message);
    
    Container.set("inputEntity", Input);
    
    Container.set("buttonEntity", Button);
}