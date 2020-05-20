import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";
import { Block } from "./block";

@Entity()
export class Input {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: "varchar",
        nullable: false
    })
    leftText: string;

    @Column({
        type: "varchar",
        nullable: false
    })
    rightText: string;

    @Column({
        type: "varchar",
        unique: true,
        nullable: false
    })
    variableName: string;

    @ManyToOne(type => Block, block => block.inputs, {
        nullable: false,
        onDelete: "CASCADE"
    })
    block: Block;
}