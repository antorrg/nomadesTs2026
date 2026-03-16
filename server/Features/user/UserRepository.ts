import { type Model } from 'sequelize'
import { User } from '../../Configs/database.js'
import { BaseRepository } from '../../Shared/Repositories/BaseRepository.js'
import { authParser, userParser, type IUserDTO, type CreateUserInput, type UpdateUserInput, type IUserWithCredentials } from './UserMappers.js'
import { IRepositoryResponse } from '../../Shared/Interfaces/base.interface.js'
import { throwError, processError } from '../../Configs/errorHandlers.js'
import envConfig from '../../Configs/envConfig.js'
import { Hasher } from './Hasher.js'

export class UserRepository extends BaseRepository<IUserDTO, CreateUserInput, UpdateUserInput> {

    async getAuthCredentials(email: string): Promise<IRepositoryResponse<IUserWithCredentials>> {
        try {
            const model = await this.Model.findOne({
                where: { email }
            })
            if (!model) {
                throwError('Usuario no hallado', 404)
            }
            return {
                message: 'Credenciales de usuario obtenidas correctamente',
                results: authParser(model as any)
            }
        } catch (error) {
            return processError(error, 'GetAuthCredentials repository error')
        }
    }
    override async update(id: string | number, data: UpdateUserInput): Promise<IRepositoryResponse<IUserDTO>> {
        try {
            const model = await this.Model.findByPk(id)
            if (!model) throwError(`${this.Model.name} no encontrado`, 404)
            
            // `model` is verified non-null above.
            const protectedUser = protectProtocol(model as any)
            if(protectedUser === true) {
                return throwError('No se puede actualizar al Admin principal', 403)
            }
            
            const updated = await model!.update(data as Partial<IUserDTO>)
            return {
                message: `${this.Model.name} registro actualizado correctamente`,
                results: userParser(updated)
            }
        } catch (error) {
            return processError(error, `Update ${this.Model.name} repository error`)
        }
    }
    async changePassword(id: string | number, data: {password: string, newPassword: string}){
        try {
            const model = await this.Model.findByPk(id)
            if (!model) throwError(`${this.Model.name} no encontrado`, 404)
            
            // `model` is verified non-null above.
            const protectedUser = protectProtocol(model as any)
            if(protectedUser === true) {
                return throwError('No se puede actualizar al Admin principal', 403)
            }
            
            const isMatch = await Hasher.comparePassword(data.password, (model as any).password)
            if(!isMatch){
                return throwError('Contraseña incorrecta', 401)
            }
            
            const hashedPassword = await Hasher.hashPassword(data.newPassword)
            const updated = await model!.update({password: hashedPassword} as Partial<IUserDTO>)
            console.log('contraseña actualizada')
            return {
                message: `Contraseña actualizada correctamente`,
                results: userParser(updated)
            }
        } catch (error) {
            return processError(error, `ChangePassword ${this.Model.name} repository error`)
        }
    }
    override async delete(id: string ): Promise<IRepositoryResponse<string>> {
        try {
            const model = await this.Model.findByPk(id)
            if (!model) throwError(`${this.Model.name} no encontrado`, 404)
            
            // `model` is verified non-null above.
            const protectedUser = protectProtocol(model as any)
            if(protectedUser === true) {
                return throwError('No se puede eliminar al Admin principal', 403)
            }
            await model!.destroy()
            return {
                message: `Usuario eliminado correctamente`,
                results: ''
            }
        } catch (error) {
            return processError(error, `Update ${this.Model.name} repository error`)
        }
    }
}
function protectProtocol(user: IUserDTO):boolean{
    if(envConfig.RootEmail === user.email){
        return true
    }return false
}