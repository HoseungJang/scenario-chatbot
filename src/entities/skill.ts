import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";
import { Chatbot } from "./chatbot";
import { Block } from "./block";

@Entity()
export class Skill {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: "varchar",
        nullable: false
    })
    name: string;

    @ManyToOne(type => Chatbot, chatbot => chatbot.skills, {
        onDelete: "CASCADE"
    })
    chatbot: Chatbot;

    @OneToMany(type => Block, block => block.skill, {
        cascade: true
    })
    blocks: Block[];
}