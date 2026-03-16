import {Media } from '../../../Models/media.model.js'


export interface IMedia {
    id: number
    url: string
    type: string
    title: string
    text: string
    enabled: boolean
}
export type CreateMedia = Partial<IMedia>
export type UpdateMedia = Partial<IMedia>



export const parser = (
  u: InstanceType<typeof Media>
): IMedia => {
  const raw = u.get({ plain: true })
  return {
    id: raw.id,
    url: raw.url,
    type: raw.type,
    title: raw.title,
    text: raw.text,
    enabled: raw.enabled
  }
}

export const mockMedia: IMedia[] = [{
    id: 0,
    type: "youtube",
    title: "Videos de you tube",
    text: "Aguarde un momento...",
    url: "",
    enabled: true
  },
    { 
    id: 0,
    type: "facebook",
    title: "Facebook",
    text: "Aguarde un momento...",
    url: "",
    enabled: true
},{ 
   id: 0,
    type: "instagram",
    title: "Instagram",
    text: "Aguarde un momento...",
    url: "",
    enabled: true
}]