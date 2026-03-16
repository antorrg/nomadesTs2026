import { 
  DataTypes, 
  Model, 
  type Sequelize, 
  type InferAttributes, 
  type InferCreationAttributes, 
  type CreationOptional, 
  type HasManyGetAssociationsMixin
} from 'sequelize'
import { type Item } from './item.model.js'

export class Product
  extends Model<InferAttributes<Product>, InferCreationAttributes<Product>>{
    declare id: CreationOptional<number>
    declare title: string
    declare picture: string
    declare info_header: string
    declare info_body: string
    declare enabled: boolean
    declare Items?: Item[]
    declare getItems: HasManyGetAssociationsMixin<Item>
  }

export default (sequelize: Sequelize) => {
  Product.init(
    {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: true },
    picture: { type: DataTypes.STRING, allowNull: true },
    info_header: { type: DataTypes.STRING, allowNull: true },
    info_body: { type: DataTypes.TEXT, allowNull: true },
    enabled: { type: DataTypes.BOOLEAN, defaultValue: true }
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
    tableName: 'products',
    timestamps: false
  })
  return Product
}
