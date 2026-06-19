import { type Model } from 'sequelize'
import {Work} from '../../../Models/work.model.js'
import envConfig from '../../Configs/envConfig.js'


  export interface IWork{
    id: number
    title: string
    picture: string
    text: string
    enabled: boolean
  }

  type WorkRaw = Omit<IWork, never>

  export const parser = (
    u: InstanceType<typeof Work> | Model
  ): IWork => {
    const raw = u.get({ plain: true }) as WorkRaw
    return {
      id: raw.id,
      title: raw.title,
      picture: raw.picture,
      text: raw.text,
      enabled: raw.enabled
    }
  }
  export const parserQuery = (
   data: unknown
  ): IWork => {
    const raw = data as WorkRaw
    
    return {
      id: raw.id,
      title: raw.title,
      picture: raw.picture,
      text: raw.text,
      enabled: raw.enabled
    }
  }
  
export const mockData: IWork = {
      id: 0,
      title: 'Aun no hay datos',
      picture: envConfig.BasePicture,
      text: 'No hay datos',
      enabled: true
}
