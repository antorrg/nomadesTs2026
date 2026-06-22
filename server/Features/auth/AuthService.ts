import { throwError } from '../../Configs/errorHandlers.js'
import { type UserRole } from '../../Shared/Auth/authMiddlewares.js'
import { Hasher } from '../user/Hasher.js'
import { type IRepositoryResponse } from '../../Shared/Interfaces/base.interface.js'
import { type IUserWithCredentials } from '../user/UserMappers.js'

interface AuthUserRepository {
    getAuthCredentials(email: string): Promise<IRepositoryResponse<IUserWithCredentials>>
}

export class AuthService {
    constructor(private readonly userRepository: AuthUserRepository) {}

    async login(email: string, password: string) {
        const { results: user } = await this.userRepository.getAuthCredentials(email)

        if (!user || !user.password) {
            throwError('Credenciales inválidas', 401)
        }

        const isMatch = await Hasher.comparePassword(password, user.password!)
        if (!isMatch) {
            throwError('Credenciales inválidas', 401)
        }

        if (!user.enabled) {
            throwError('Cuenta deshabilitada', 403)
        }

        // Retornamos solo lo necesario para la sesión
        return {
            id: user.id,
            email: user.email,
            role: user.role as UserRole
        }
    }
}
