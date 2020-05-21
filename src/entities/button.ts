import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Block } from "../entities/block";

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
    
    @ManyToOne(type => Block, {
        onDelete: "CASCADE"
    })
    @JoinColumn({ name: "previous" })
    previous: number;

    @ManyToOne(type => Block, {
        onDelete: "CASCADE"
    })
    @JoinColumn({ name: "jumpTo" })
    jumpTo: number;
}