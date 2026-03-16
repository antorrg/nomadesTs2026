export interface LandingResults {
    id: number;
    picture: string;
    title: string;
    info_header: string;
    description: string;
    enabled: boolean;
}
export interface ILanding {
    success: boolean
    message: string
    results: LandingResults
}
export interface ILandings {
    success: boolean
    message: string
    results: LandingResults[]
}

export type CreateLanding = Partial<LandingResults> & { useImg?: boolean };
export type UpdateLanding = Partial<LandingResults> & { useImg?: boolean; saver?: boolean };


