export interface IImage {
    id: number;
    imageUrl: string;
    filename: string;
    mimetype: string;
    size: number;
    createdAt: string;
}

export interface UploadImageResponse {
    url: string;
    filename: string;
}

export interface SaveImageInput {
    url: string;
}
