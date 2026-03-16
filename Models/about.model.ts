import { DataTypes, Model, type Sequelize, type Optional } from 'sequelize'

export interface AboutAttributes {
    id: number
    title: string
    picture: string 
    text: string 
    imgShow: boolean
    enabled: boolean

}
export type AboutCreationAttributes = Optional<AboutAttributes,
'id'| 'imgShow' | 'enabled'>

export class About 
    extends Model<AboutAttributes, AboutCreationAttributes>
    implements AboutAttributes{
    declare id: number
    declare title: string
    declare picture: string 
    declare text: string 
    declare imgShow: boolean
    declare enabled: boolean
    }

export default (sequelize: Sequelize) => {
  About.init(
    {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true
    },
    picture: {
      type: DataTypes.STRING,
      allowNull: true
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    enabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    imgShow: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    scopes: {
      enabledOnly: {
        where: {
          enabled: true
        }
      },
      allRecords: {} // No aplica ningún filtro
    },
    sequelize,
    tableName: 'abouts',
    timestamps: false
  })
  return About
}
