import { DataTypes, Model, type Sequelize, type Optional } from 'sequelize'

export interface ImageAttributes {
  id: number
  imageUrl: string
  enabled: boolean
}
export type ImageCreationAttributes = Optional<ImageAttributes,
'id'| 'enabled'>

export class Image extends Model<ImageAttributes, ImageCreationAttributes>
implements ImageAttributes {
  declare id: number
  declare imageUrl: string
  declare enabled: boolean
}

export default (sequelize: Sequelize) => {
  Image.init(
    {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    enabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    sequelize,
    tableName: 'images',
    timestamps: false
  })
  return Image
}
