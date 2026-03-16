import { 
  DataTypes, 
  Model, 
  type Sequelize, 
  type InferAttributes, 
  type InferCreationAttributes, 
  type CreationOptional, 
  type BelongsToGetAssociationMixin 
} from 'sequelize'
import { type Product } from './product.model.js'


export class Item
  extends Model<InferAttributes<Item>, InferCreationAttributes<Item>>{
    declare id: CreationOptional<number>
    declare picture: string
    declare text: string
    declare enabled?: boolean
    declare ProductId: number
    declare Product?: Product
    declare getProduct: BelongsToGetAssociationMixin<Product>
  }

export default (sequelize: Sequelize) => {
  Item.init(
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
    text: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    enabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
     ProductId: { type: DataTypes.INTEGER }
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
    tableName: 'items',
    timestamps: false
  })
  return Item
}
