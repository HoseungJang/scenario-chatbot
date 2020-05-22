export interface IMessage {
    id: number;
    type: "text" | "image";
    data: string | number;
    slot: boolean;
}

export interface IMessageDTO {
    images: Express.Multer.File[];
    messages: {
        type: "text" | "image";
        data: string | number;
        slot: boolean;
    }[];
    blockId: number;
}