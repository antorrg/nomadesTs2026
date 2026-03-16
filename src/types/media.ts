export interface IMedia {
    id: number;
    url: string;
    type: string;
    title: string;
    text: string;
    enabled: boolean;
}

export type CreateMedia = Partial<IMedia>;
export type UpdateMedia = Partial<IMedia>;
