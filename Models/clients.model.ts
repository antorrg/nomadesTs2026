import { type Sequelize, DataTypes, Model, InferAttributes, InferCreationAttributes } from 'sequelize'



// Definición de la clase User tipada
export class Client extends
Model<InferAttributes<Client>, InferCreationAttributes<Client>>{
  declare id: string
  declare email: string
  declare identityHash: string
  declare nickname: string | null
  declare name: string | null
  declare picture: string | null
  declare enabled: boolean
}

// Función que define el modelo 
export default (sequelize: Sequelize) => {
  Client.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false
      },
      identityHash: {
        type: DataTypes.STRING,
        allowNull: false
      },
      nickname: {
        type: DataTypes.STRING,
        allowNull: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true
      },
      picture: {
        type: DataTypes.STRING,
        allowNull: true
      },
      enabled: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true
      }
    },
    {
      sequelize,
      tableName: 'clients',
      timestamps: false
    }
  )

  return Client
}
