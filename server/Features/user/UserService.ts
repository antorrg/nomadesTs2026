import { BaseServiceWithImages } from '../../Shared/Services/BaseServiceWithImages.js'
import { UserRepository } from './UserRepository.js'
import { type IExternalImageDeleteService } from '../../Shared/Interfaces/base.interface.js'
import { type IUserDTO, type CreateUserInput, type UpdateUserInput } from './UserMappers.js'

export class UserService extends BaseServiceWithImages<IUserDTO, CreateUserInput, UpdateUserInput> {
  protected override repository: UserRepository

  constructor(
    repository: UserRepository,
    imageHandlerService: IExternalImageDeleteService<any>,
    useImage: boolean = false,
    nameImage: keyof IUserDTO
  ) {
    super(repository, imageHandlerService, useImage, nameImage)
    this.repository = repository
  }

  changePassword = async (id: string|number, data: any) => {
    return await this.repository.changePassword(id, data)
  }
}
