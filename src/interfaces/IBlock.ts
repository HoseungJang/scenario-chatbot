export interface IBlock {
    id: number;
    name: string;
}

export interface IBlockDTO {
    name: string;
    skillId: number;
}

export interface IBlockInfo {
    messages: {
        type: "text" | "image";
        data: string;
        slot: boolean;
    }[];
    next: {
        type: "input" | "button";
        data: {
            leftText: string;
            rightText: string;
            variableName: string;
            jumpTo: number;
        } | {
            data: string;
            jumpTo: number;
        }[];
    }
}