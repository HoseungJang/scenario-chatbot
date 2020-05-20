import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";
import { Skill } from "./skill";
import { Message } from "./message";
import { Input } from "./input";
import { Button } from "./button";

@Entity()
export class Block {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: "varchar",
        nullable: false
    })
    name: string;

    @Column({
        type: "varchar",
        nullable: true
    })
    nextType: string;

    @ManyToOne(type => Skill, skill => skill.blocks, {
        nullable: false,
        onDelete: "CASCADE"
    })
    skill: Skill;

    @OneToMany(type => Message, message => message.block, {
        cascade: true
    })
    messages: Message[];

    @OneToMany(type => Input, input => input.block, {
        cascade: true
    })
    inputs: Input[];

    @OneToMany(type => Button, button => button.block, {
        cascade: true
    })
    buttons: Button[];
}