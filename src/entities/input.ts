import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";

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