import { 
  DataTypes, 
  Model, 
  type Sequelize, 
  type InferAttributes, 
  type InferCreationAttributes, 
  type CreationOptional 
} from 'sequelize'

export class MediaConfig extends Model<InferAttributes<MediaConfig>, InferCreationAttributes<MediaConfig>> {
  declare id: CreationOptional<number>
  declare showFacebook: boolean
  declare showInstagram: boolean
  declare showYouTube: boolean
}

export default (sequelize: Sequelize) => {
  MediaConfig.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      showFacebook: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      },
      showInstagram: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      },
      showYouTube: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      }
    },
    {
      sequelize,
      tableName: 'mediaConfigs',
      timestamps: false
    }
  )
  return MediaConfig
}
