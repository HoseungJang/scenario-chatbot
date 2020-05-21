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

    @ManyToOne(type => Chatbot, {
        onDelete: "CASCADE"
    })
    chatbot: Chatbot;
}