
export interface IHightLight {
    id: number;
    title: string;
    picture: string;
    text: string;
    showTitle:boolean
    order?: number | undefined | null
    enabled: boolean;
}

export type CreateHighLight = Partial<IHightLight> & { useImg?: boolean };
export type UpdateHighLight = Partial<IHightLight> & { useImg?: boolean; saver?: boolean };
