import { 
  DataTypes, 
  Model, 
  type Sequelize, 
  type InferAttributes, 
  type InferCreationAttributes, 
  type CreationOptional, 
} from 'sequelize'


export class Media extends Model<InferAttributes<Media>, InferCreationAttributes<Media>>{
  declare id: CreationOptional<number>
  declare url: string
  declare type: string
  declare title: string
  declare text: string
  declare enabled: boolean
}

export default (sequelize: Sequelize) => {
  Media.init(
     {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    url: {
      type: DataTypes.STRING,
      allowNull: true
    },
    type: {
      type: DataTypes.STRING,
      allowNull: true
    },
    title: {
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
    tableName: 'medias',
    timestamps: false
  })
  return Media
}
