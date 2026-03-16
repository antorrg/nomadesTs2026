import {type Image } from '../../../Models/images.model.js'

export interface Images{
    id: number | string
    imageUrl: string
}
export type CreateImages = Omit<Images, 'id'>

export interface ImagesRepository<Images, CreateImages> {
    saveImage: (url: CreateImages) => Promise<Images>
    getImages: () => Promise<Images[]>
    deleteImage: (dataImage: string | number, isId:boolean)=>Promise<string>
}

export const parser =(u:  InstanceType<typeof Image>):Images => {
  const raw = u.get()
 return {
  id: raw.id,
  imageUrl: raw.imageUrl
 }
}