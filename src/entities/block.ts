import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";
import { Skill } from "./skill";
import { Message } from "./message";

@Entity()
export class Block {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: "varchar",
        nullable: false
    })
    name: string;

    @ManyToOne(type => Skill, skill => skill.blocks, {
        nullable: false,
        onDelete: "CASCADE"
    })
    skill: Skill;

    @OneToMany(type => Message, message => message.block, {
        cascade: true
    })
    messages: Message[];
}