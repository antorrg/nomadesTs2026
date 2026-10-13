export interface FrontPageResults {
    id: number;
    picture: string;
    title: string;
    info_header: string;
    description: string;
    enabled: boolean;
    showMarketing:boolean
    showHighLights: boolean
}

export interface IFrontPage {
    success: boolean
    message: string
    results: FrontPageResults
}

export interface IFrontPages {
    success: boolean
    message: string
    results: FrontPageResults[]
}

export type CreateFrontPage = Partial<FrontPageResults> & { useImg?: boolean };
export type UpdateFrontPage = Partial<FrontPageResults> & { useImg?: boolean; saver?: boolean };
export type SwitchedVisibility = Pick<FrontPageResults, 'showHighLights' | 'showMarketing'>
