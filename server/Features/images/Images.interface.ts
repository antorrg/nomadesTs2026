import { type Model } from 'sequelize'

export interface Images{
    id: number | string
    imageUrl: string
}
export type CreateImages = Omit<Images, 'id'>

export interface ImagesRepository<TImage, TCreateImage> {
    saveImage: (url: TCreateImage) => Promise<TImage>
    getImages: () => Promise<TImage[]>
    deleteImageFromDbById: (id: string | number)=>Promise<string>
    deleteImageFromDbByUrl: (dataImage: string | number)=>Promise<string>
}

export const parser = (u: Model): Images => {
  const raw = u.get() as Images
 return {
  id: raw.id,
  imageUrl: raw.imageUrl
 }
}
