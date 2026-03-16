import { throwError } from '../../Configs/errorHandlers.js'
import { type IBaseRepository, type IRepositoryResponse, type IPaginatedOptions, type IPaginatedResults, type IExternalImageDeleteService } from '../Interfaces/base.interface.js'


export class BaseService<TDTO, TCreate, TUpdate> {
  protected repository: IBaseRepository<TDTO, TCreate, TUpdate>
 

  constructor(
    repository: IBaseRepository<TDTO, TCreate, TUpdate>,

  ) {
    this.repository = repository
   
  }



  async getAll(field?: unknown, whereField?: keyof TDTO | string): Promise<IRepositoryResponse<TDTO[]>> {
    return await this.repository.getAll(field, whereField)
  }

  async getById(id: string | number): Promise<IRepositoryResponse<TDTO>> {
    return await this.repository.getById(id)
  }

  async getByField(field: unknown, whereField: keyof TDTO | string): Promise<IRepositoryResponse<TDTO>> {
    return await this.repository.getByField(field, whereField)
  }

  async getWithPages(options?: IPaginatedOptions<TDTO>): Promise<IPaginatedResults<TDTO>> {
    return await this.repository.getWithPages(options)
  }

  async create(data: TCreate): Promise<IRepositoryResponse<TDTO>> {
    return await this.repository.create(data)

  }

  async update(
    id: string | number,
    data: TUpdate
  ): Promise<IRepositoryResponse<TDTO>> {
    return await this.repository.update(id, data)
  }

  async delete(id: string | number): Promise<IRepositoryResponse<string>> {
    return await this.repository.delete(id)
  }

  async getAllScoped(scope: string = 'enabledOnly'): Promise<IRepositoryResponse<TDTO[]>> {
    return await this.repository.getAllScoped(scope)
  }

  async getByIdScoped(id: string | number, scope: string = 'enabledOnly'): Promise<IRepositoryResponse<TDTO>> {
    return await this.repository.getByIdScoped(id, scope)
  }
}
