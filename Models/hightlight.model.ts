import { 
  DataTypes, 
  Model, 
  type Sequelize, 
  type InferAttributes, 
  type InferCreationAttributes, 
  type CreationOptional, 
} from 'sequelize'

export class Hightlight extends Model<InferAttributes<Hightlight >, InferCreationAttributes<Hightlight >>{
  declare id: CreationOptional<number>
  declare title: string
  declare picture: string
  declare text: string
  declare showTitle: CreationOptional<boolean>
  declare order: CreationOptional<number>
  declare enabled: CreationOptional<boolean>
}
export default (sequelize:Sequelize) => {
  Hightlight.init(
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
    showTitle: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    order: {
      type: DataTypes.INTEGER,
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
    tableName: 'hightlight',
    timestamps: true
  })
  return Hightlight 
}
