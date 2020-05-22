import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
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

    @ManyToOne(type => Block, {
        onDelete: "CASCADE"
    })
    @JoinColumn({ name: "previous" })
    previous: Block;

    @ManyToOne(type => Block, {
        onDelete: "CASCADE"
    })
    @JoinColumn({ name: "jumpTo" })
    jumpTo: Block;
}