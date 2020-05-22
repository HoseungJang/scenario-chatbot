export interface IButton {
    id: number;
    data: string;
    previous: number;
    jumpTo: number;
}

export interface IButtonDTO {
    buttons: {
        data: string;
        jumpTo: number;
    }[];
    blockId: number;
}