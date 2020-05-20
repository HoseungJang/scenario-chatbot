import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";

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
    
    @Column({
        type: "int",
        nullable: false,
        width: 11
    })
    previous: number;

    @Column({
        type: "int",
        nullable: false,
        width: 11
    })
    jumpTo: number;
}