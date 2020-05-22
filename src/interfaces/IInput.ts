export interface IInput {
    id: number;
    leftText: string;
    rightText: string;
    variableName: string;
    previous: number;
    jumpTo: number;
}

export interface IInputDTO {
    leftText: string;
    rightText: string;
    variableName: string;
    previous: number;
    jumpTo: number;
}