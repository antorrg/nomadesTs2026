import { describe, it, expect, vi, beforeEach } from 'vitest'
import { UserService } from './UserService.ts'
import envConfig from '../../Configs/envConfig.ts'

describe('UserService - BasePicture protection (update/delete)', () => {
  const userId = 'user-1'
  const customPicture = 'uploads/custom-old.jpg'
  const newPicture = 'uploads/new.jpg'

  const repository = {
    getById: vi.fn(),
    update: vi.fn(),
    delete: vi.fn()
  }
  const imageHandler = {
    releaseImageFromDb: vi.fn(),
    handleImages: vi.fn()
  }
  const emailService = {}

  const buildService = () =>
    new UserService(
      repository as any, //eslint-disable-line
      imageHandler as any, //eslint-disable-line
      true,
      'picture',
      emailService as any //eslint-disable-line
    )

  const mockUser = (picture: string) =>
    repository.getById.mockResolvedValue({ message: 'ok', results: { id: userId, picture } })

  beforeEach(() => {
    vi.clearAllMocks()
    repository.update.mockResolvedValue({ message: 'Actualizado', results: { id: userId, picture: newPicture } })
    repository.delete.mockResolvedValue({ message: 'Registro eliminado correctamente', results: 'deleted' })
    imageHandler.handleImages.mockResolvedValue('imagen borrada correctamente')
  })

  describe('update', () => {
    it('no debe borrar ni guardar la imagen vieja si es BasePicture, pero sí consume la nueva', async () => {
      mockUser(envConfig.BasePicture)
      const service = buildService()

      const res = await service.update(userId, { picture: newPicture } as any) //eslint-disable-line

      expect(repository.update).toHaveBeenCalledOnce()
      expect(imageHandler.releaseImageFromDb).toHaveBeenCalledWith(newPicture)
      expect(imageHandler.handleImages).not.toHaveBeenCalled()
      expect(res.message).toBe('Actualizado')
    })

    it('no debe tocar imágenes si no se envía imagen nueva y la actual es BasePicture', async () => {
      mockUser(envConfig.BasePicture)
      const service = buildService()

      await service.update(userId, { name: 'Otro' } as any) //eslint-disable-line

      expect(imageHandler.releaseImageFromDb).not.toHaveBeenCalled()
      expect(imageHandler.handleImages).not.toHaveBeenCalled()
    })

    it('debe borrar la imagen vieja (comportamiento normal) si no es BasePicture', async () => {
      mockUser(customPicture)
      const service = buildService()

      const res = await service.update(userId, { picture: newPicture } as any) //eslint-disable-line

      expect(imageHandler.releaseImageFromDb).toHaveBeenCalledWith(newPicture)
      expect(imageHandler.handleImages).toHaveBeenCalledWith(customPicture, false)
      expect(res.message).toContain('Imagen antigua: imagen borrada correctamente')
    })

    it('debe conservar la imagen vieja si saver es true y no es BasePicture', async () => {
      mockUser(customPicture)
      const service = buildService()

      await service.update(userId, { picture: newPicture, saver: true } as any) //eslint-disable-line

      expect(imageHandler.handleImages).toHaveBeenCalledWith(customPicture, true)
    })
  })

  describe('delete', () => {
    it('solo debe borrar el registro, sin tocar la imagen, si es BasePicture', async () => {
      mockUser(envConfig.BasePicture)
      const service = buildService()

      const res = await service.delete(userId)

      expect(repository.delete).toHaveBeenCalledWith(userId)
      expect(imageHandler.handleImages).not.toHaveBeenCalled()
      expect(res.message).toBe('Registro eliminado correctamente')
    })

    it('debe borrar la imagen junto al registro si no es BasePicture', async () => {
      mockUser(customPicture)
      const service = buildService()

      const res = await service.delete(userId)

      expect(imageHandler.handleImages).toHaveBeenCalledWith(customPicture, false)
      expect(res.message).toBe('Registro eliminado correctamente con imagen borrada correctamente')
    })
  })
})
