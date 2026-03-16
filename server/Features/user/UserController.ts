import { type Request, type Response } from 'express'
import { BaseController } from '../../Shared/Controllers/BaseController.js'
import { type BaseServiceWithImages } from '../../Shared/Services/BaseServiceWithImages.js'
import { type IUserDTO, type CreateUserInput, type UpdateUserInput } from './UserMappers.js'
import { UserService } from './UserService.js'

export class UserController extends BaseController<IUserDTO, CreateUserInput, UpdateUserInput> {
  
  changePassword = async (req: Request, res: Response) => {
    const { id } = req.params
    const data = req.body
    
    // We access the changePassword method formally through the UserService layer
    const { message, results } = await (this.service as UserService).changePassword(id as string, data)
    
    BaseController.responder(res, 200, true, message, results)
  }
}
