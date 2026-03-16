export interface IWork {
    id: number;
    title: string;
    picture: string;
    text: string;
    enabled: boolean;
}

export type CreateWork = Partial<IWork> & { useImg?: boolean };
export type UpdateWork = Partial<IWork> & { useImg?: boolean; saver?: boolean };
