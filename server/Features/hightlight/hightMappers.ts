import { type Model } from 'sequelize'
import { Hightlight } from '../../hightlight.model.js'
import envConfig from '../../Configs/envConfig.js'


  export interface IHightlight {
    id: number
    title: string
    picture: string
    text: string
    showTitle: boolean
    order: number
    enabled: boolean
  }

  type HightlightRaw = Omit<IHightlight , never>

  export const parser = (
    u: InstanceType<typeof Hightlight > | Model
  ): IHightlight  => {
    const raw = u.get({ plain: true }) as HightlightRaw
    return {
      id: raw.id,
      title: raw.title,
      picture: raw.picture,
      text: raw.text,
      showTitle: raw.showTitle,
      order: raw.order,
      enabled: raw.enabled
    }
  }
  export const parserQuery = (
   data: unknown
  ): IHightlight  => {
    const raw = data as HightlightRaw
    
    return {
      id: raw.id,
      title: raw.title,
      picture: raw.picture,
      text: raw.text,
      showTitle: raw.showTitle,
      order: raw.order,
      enabled: raw.enabled
    }
  }
  
export const mockData: IHightlight  = {
      id: 0,
      title: 'Aun no hay datos',
      picture: envConfig.BasePicture,
      text: 'No hay datos',
      showTitle: true,
      order:0,
      enabled: true
}
//   declare title: string
//   declare picture: string
//   declare text: string
//   declare showTitle: boolean
//   declare order: number
//   declare enabled: boolean
