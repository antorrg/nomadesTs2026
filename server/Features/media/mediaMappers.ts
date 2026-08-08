import { type Model } from 'sequelize'
import { Media } from '../../../Models/media.model.js'
import { MediaConfig } from '../../../Models/mediaConfig.model.js'

export interface IMedia {
    id: number | string
    url?: string
    type: string
    title?: string
    text?: string
    enabled: boolean
    showFacebook?: boolean
    showInstagram?: boolean
    showYouTube?: boolean
}

export interface IMediaConfig {
    id: number
    showFacebook: boolean
    showInstagram: boolean
    showYouTube: boolean
}

export type CreateMedia = Partial<IMedia>
export type UpdateMedia = Partial<IMedia>

export type CreateMediaConfig = Partial<IMediaConfig>
export type UpdateMediaConfig = Partial<IMediaConfig>

type MediaRaw = Omit<IMedia, never>
type MediaConfigRaw = Omit<IMediaConfig, never>

export const parser = (
  u: InstanceType<typeof Media> | Model
): IMedia => {
  const raw = u.get({ plain: true }) as MediaRaw
  return {
    id: raw.id,
    url: raw.url || '',
    type: raw.type,
    title: raw.title || '',
    text: raw.text || '',
    enabled: raw.enabled
  }
}

export const parserQuery = (
  data: unknown
): IMedia => {
  const raw = data as MediaRaw
  return {
    id: raw.id,
    url: raw.url || '',
    type: raw.type,
    title: raw.title || '',
    text: raw.text || '',
    enabled: raw.enabled
  }
}

export const parserConfig = (
  u: InstanceType<typeof MediaConfig> | Model
): IMediaConfig => {
  const raw = u.get({ plain: true }) as MediaConfigRaw
  return {
    id: raw.id,
    showFacebook: raw.showFacebook ?? true,
    showInstagram: raw.showInstagram ?? true,
    showYouTube: raw.showYouTube ?? true
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
