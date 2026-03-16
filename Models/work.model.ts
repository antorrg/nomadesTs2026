import { 
  DataTypes, 
  Model, 
  type Sequelize, 
  type InferAttributes, 
  type InferCreationAttributes, 
  type CreationOptional, 
} from 'sequelize'

export class Work extends Model<InferAttributes<Work>, InferCreationAttributes<Work>>{
  declare id: CreationOptional<number>
  declare title: string
  declare picture: string
  declare text: string
  declare enabled: boolean
}
export default (sequelize:Sequelize) => {
  Work.init(
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
    tableName: 'works',
    timestamps: false
  })
  return Work
}
