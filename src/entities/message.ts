import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";
import { Block } from "./block";

@Entity()
export class Message {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: "varchar",
        nullable: false
    })
    type: string;

    @Column({
        type: "varchar",
        length: 1000,
        nullable: false
    })
    data: string;

    @Column({
        type: "boolean",
        nullable: false
    })
    slot: boolean;

    @ManyToOne(type => Block, {
        onDelete: "CASCADE"
    })
    block: Block;
}