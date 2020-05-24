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
    }[];
    next: "input" | "button" | null;
}

export interface IBlockInfoDTO {
    blockId: number;
    variables: {
        name: string,
        data: string
    }[];
}