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

    @ManyToOne(type => Skill, {
        onDelete: "CASCADE"
    })
    skill: Skill;
}