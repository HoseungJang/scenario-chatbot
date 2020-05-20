import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Skill } from "./skill";

@Entity()
export class Chatbot {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: "varchar",
        nullable: false
    })
    name: string;

    @Column({
        type: "varchar",
        nullable: false
    })
    role: string;

    @OneToMany(type => Skill, skill => skill.chatbot, {
        cascade: true
    })
    skills: Skill[];
}