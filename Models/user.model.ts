import { type Sequelize, DataTypes, Model, type Optional } from 'sequelize'
import { UserRole } from '../server/Shared/Auth/authMiddlewares.js'

// Atributos que tiene la tabla
export interface UserAttributes {
  id: string
  email: string
  password: string
  nickname?: string | null
  name?: string | null
  picture?: string | null
  role: UserRole
  enabled: boolean
}

// Atributos opcionales al crear (por ejemplo uid=1000(antonio) gid=1000(antonio) grupos=1000(antonio),4(adm),24(cdrom),27(sudo),30(dip),46(plugdev),115(lpadmin),136(sambashare) lo genera Sequelize)
export type UserCreationAttributes = Optional<
UserAttributes,
'id' | 'nickname' | 'name' | 'picture' | 'enabled'
>

// Definición de la clase User tipada
export class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes {
  declare id: string
  declare email: string
  declare password: string
  declare nickname: string | null
  declare name: string | null
  declare picture: string | null
  declare role: UserRole
  declare enabled: boolean
}

// Función que define el modelo 
export default (sequelize: Sequelize) => {
  User.init(
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
      password: {
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
      role: {
      type: DataTypes.ENUM(...Object.values(UserRole)),
      defaultValue: UserRole.USER,
    },
      enabled: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true
      }
    },
    {
      sequelize,
      tableName: 'users',
      timestamps: false
    }
  )

  return User
}
