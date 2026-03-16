import { DataTypes, Model, type Sequelize, type Optional } from 'sequelize'

export interface LandingAttributes {
  id: number
  picture: string
  title: string
  info_header: string
  description: string
  enabled: boolean
}
export type CreateLandingAttributes = Optional<LandingAttributes,
'id'| 'enabled'>

export class Landing 
  extends Model<LandingAttributes, CreateLandingAttributes>
  implements LandingAttributes {
  declare id: number
  declare picture: string
  declare title: string
  declare info_header: string
  declare description: string
  declare enabled: boolean
  }


export default (sequelize: Sequelize) => {
  Landing.init(
    {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    picture: {
      type: DataTypes.STRING,
      allowNull: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true
    },
    info_header: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    enabled: {
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
    tableName: 'landings',
    timestamps: false
  })
  return Landing
}
