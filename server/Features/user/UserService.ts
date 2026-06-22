import { BaseServiceWithImages } from '../../Shared/Services/BaseServiceWithImages.js'
import { UserRepository } from './UserRepository.js'
import { type IExternalImageDeleteService, type IRepositoryResponse } from '../../Shared/Interfaces/base.interface.js'
import { type IUserDTO, type CreateUserInput, type UpdateUserInput, type IResetPassword } from './UserMappers.js'
import { throwError } from '../../Configs/errorHandlers.js'
import { type EmailService } from '../../ExternalServices/EmailService/EmailService.js'
import envConfig from '../../Configs/envConfig.js'
import logger from '../../Configs/logger.js'



export class UserService extends BaseServiceWithImages<IUserDTO, CreateUserInput, UpdateUserInput> {
  protected override repository: UserRepository
  protected emailService: EmailService

  constructor(
    repository: UserRepository,
    imageHandlerService: IExternalImageDeleteService<string>,
    useImage: boolean = false,
    nameImage: keyof IUserDTO,
    emailService: EmailService
  ) {
    super(repository, imageHandlerService, useImage, nameImage)
    this.repository = repository
    this.emailService = emailService
  }

  changePassword = async (id: string|number, data: { password: string, newPassword: string }) => {
    return await this.repository.changePassword(id, data)
  }

  override create = async (data: CreateUserInput & { plainPassword?: string }): Promise<IRepositoryResponse<IUserDTO>> => {
    const response = await super.create(data);
    
    if (response && response.results) {
      if (envConfig.Status === 'test') {
        logger.info(`[Test Env Mock] Simulated welcome mail generated to: ${response.results.email}`);
        (response.results as any).testPassword = data.plainPassword;
      } else {
        await this.emailService.sendTemplateEmail(
          'welcome',
          { nickname: response.results.nickname!, password: data.plainPassword || 'N/A' },
          { to: response.results.email, subject: "¡Bienvenido/a a Nomades!" }
        ).catch(err => logger.error(`Welcome email failed: ${err}`));
      }
    }
    
    return response;
  }

  resetPassword = async (id: string|number, data: IResetPassword) => {
    const { hashedPassword, plainPassword } = data

    const response = await this.repository.update(id, {password: hashedPassword})
    if(!response){ throwError('Error actualizando contraseña', 500)}
    
    if (envConfig.Status === 'test') {
      logger.info(`[Test Env Mock] Simulated password reset mail generated to: ${response.results.email}`);
      (response.results as any).testPassword = plainPassword;
    } else {
      const userName = response.results.nickname || response.results.email.split('@')[0];
      await this.emailService.sendTemplateEmail(
        'reset-pass-sucessfully',
        { user_name: userName, new_password: plainPassword },
        { to: response.results.email, subject: "Restablecimiento de Contraseña - Nómades" }
      );
    }
    return {
      message: response.message,
      results: response.results
    }

  }
}
