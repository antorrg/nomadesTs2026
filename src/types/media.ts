export interface IMedia {
    id: number |string;
    url: string;
    type: string;
    title: string;
    text: string;
    enabled: boolean;
}

export type CreateMedia = Partial<IMedia>;
export type UpdateMedia = Partial<IMedia>;
