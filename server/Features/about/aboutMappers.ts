import { type Model } from 'sequelize'
import { About } from '../../about.model.js'
import envConfig from '../../Configs/envConfig.js'

export interface IAbout {
  id: number
  title: string
  picture: string
  text: string
  imgShow: boolean
  enabled: boolean
}
export type CreateAbout = Partial<IAbout>
export type UpdateAbout = Partial<IAbout>

type AboutRaw = Omit<IAbout, never>


export const parser = (
  u: InstanceType<typeof About> | Model
): IAbout => {
  const raw = u.get({ plain: true }) as AboutRaw
  return {
    id: raw.id,
    picture: raw.picture,
    title: raw.title,
    text: raw.text,
    imgShow: raw.imgShow,
    enabled: raw.enabled
  }
}
export const parserQuery = (
  data: unknown
): IAbout => {
  const raw = data as AboutRaw
  return {
    id: raw.id,
    picture: raw.picture,
    title: raw.title,
    text: raw.text,
    imgShow: raw.imgShow,
    enabled: raw.enabled
  }
}

export const mockAbout: IAbout[] = [{
  id: 0,
  picture: envConfig.BasePicture,
  title: 'Aun no hay datos',
  text: 'Aun no hay datos',
  imgShow: false,
  enabled: true
}]
