import { BaseServiceWithImages } from '../../Shared/Services/BaseServiceWithImages.js'
import { UserRepository } from './UserRepository.js'
import { type IExternalImageDeleteService } from '../../Shared/Interfaces/base.interface.js'
import { type IUserDTO, type CreateUserInput, type UpdateUserInput, type IResetPassword } from './UserMappers.js'
import { throwError } from '../../Configs/errorHandlers.js'



export class UserService extends BaseServiceWithImages<IUserDTO, CreateUserInput, UpdateUserInput> {
  protected override repository: UserRepository

  constructor(
    repository: UserRepository,
    imageHandlerService: IExternalImageDeleteService<any>,
    useImage: boolean = false,
    nameImage: keyof IUserDTO,
    emailService:(email: string, plainPassword:string) => Promise<void>
  ) {
    super(repository, imageHandlerService, useImage, nameImage)
    this.repository = repository
    this.emailService = emailService
  }

  changePassword = async (id: string|number, data: any) => {
    return await this.repository.changePassword(id, data)
  }
  resetPassword = async (id: string|number, data: IResetPassword) => {
    const { hashedPassword, plainPassword } = data

    const response = await this.repository.update(id, {password: hashedPassword})
    if(!response){ throwError('Error actualizando contraseña', 500)}
    await this.emailService(response.results.email, plainPassword)
    return {
      message: response.message,
      results: response.results
    }

  }
}
