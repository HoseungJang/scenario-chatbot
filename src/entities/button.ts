import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Block } from "./block";

@Entity()
export class Button {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: "varchar",
        unique: true,
        nullable: false
    })
    data: string;
    
    @ManyToOne(type => Block, block => block.buttons, {
        nullable: false,
        onDelete: "CASCADE"
    })
    @JoinColumn({ name: "jumpTo" })
    jumpTo: number;

    @ManyToOne(type => Block, block => block.buttons, {
        nullable: false,
        onDelete: "CASCADE"
    })
    block: Block;
}