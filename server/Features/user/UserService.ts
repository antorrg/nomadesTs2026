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
        (response.results as any).testPassword = data.plainPassword; //eslint-disable-line
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
      (response.results as any).testPassword = plainPassword;//eslint-disable-line
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

  /** Indica si la imagen es la imagen por defecto compartida (no debe borrarse ni archivarse). */
  private isDefaultPicture(imageUrl?: string | null): boolean {
    return !!imageUrl && imageUrl === envConfig.BasePicture
  }

  override async update(
    id: string | number,
    data: UpdateUserInput
  ): Promise<IRepositoryResponse<IUserDTO>> {
    try {
      const register = await this.getById(id)
      if (!register) throwError('Elemento no hallado', 404)

      const payload = data as UpdateUserInput & { saver?: boolean }
      const oldImageUrl = register.results[this.nameImage] as unknown as string
      const newImageUrl = payload[this.nameImage as unknown as keyof UpdateUserInput] as unknown as string

      const isNewImage = newImageUrl && oldImageUrl !== newImageUrl

      const updated = await this.repository.update(id, data)

      let imageMessage = ''

      // 1. Imagen NUEVA: se consume
      if (this.useImage && isNewImage && newImageUrl) {
        await this.releaseImage(newImageUrl)
      }

      // 2. Imagen VIEJA: se omite si es la imagen por defecto (BasePicture)
      if (this.useImage && isNewImage && oldImageUrl && !this.isDefaultPicture(oldImageUrl)) {
        const shouldSaveOld = payload.saver === true
        const res = await this.handleImages(oldImageUrl, shouldSaveOld)
        if (res) imageMessage = `\nImagen antigua: ${res}`
      }

      return {
        message: `${updated.message}${imageMessage}`,
        results: updated.results
      }
    } catch (error) {
      console.error('Update error', error)
      throw error
    }
  }

  override async delete(id: string | number): Promise<IRepositoryResponse<string>> {
    try {
      const register = await this.getById(id)
      if (!register) throwError('Elemento no hallado', 404)

      const imageUrl = register.results[this.nameImage] as unknown as string

      const deleted = await this.repository.delete(id)

      let imageMessage = ''
      // Si la imagen es la por defecto (BasePicture), solo se borra el registro
      if (this.useImage && imageUrl && !this.isDefaultPicture(imageUrl)) {
        const res = await this.handleImages(imageUrl, false)
        if (res) imageMessage = ` con ${res}`
      }

      return {
        message: `${deleted.message}${imageMessage}`,
        results: deleted.results
      }
    } catch (error) {
      console.error('Error deleting: ', error)
      throw error
    }
  }
}
