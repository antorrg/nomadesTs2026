import type { Model, ModelStatic } from 'sequelize'
import type { IBaseRepository, IRepositoryResponse, IPaginatedOptions, IPaginatedResults, Direction } from '../Interfaces/base.interface.js'
import { throwError, processError } from '../../Configs/errorHandlers.js'

export class BaseRepository<
  TDTO, TCreate, TUpdate = Partial<TCreate>,
> implements IBaseRepository<TDTO, TCreate, TUpdate> {
  constructor(
    protected readonly Model: ModelStatic<Model>,
    private readonly parserFn: (model: Model) => TDTO,
    private readonly modelName: string,
    private readonly whereField: keyof TDTO & string,
    protected readonly emptyObject: TDTO
  ) {
    this.Model = Model
    this.parserFn = parserFn
    this.whereField = whereField
    this.emptyObject = emptyObject
  }

  async getAll(field?: unknown, whereField?: keyof TDTO | string): Promise<IRepositoryResponse<TDTO[]>> {
    try {
      const whereClause = (field && whereField) ? { [whereField]: field } : {}
      const models = await this.Model.findAll({ where: whereClause })
      if (models.length === 0) {
        return {
          message: `${this.Model.name} no contiene datos`,
          results: this.emptyObject as TDTO[]
        }
      }
      return {
        message: `${this.Model.name} registros obtenidos correctamente`,
        results: models.map(this.parserFn)
      }
    } catch (error) {
      return processError(error, `GetAll ${this.Model.name} repository error`)
    }
  }

  async getWithPages(options?: IPaginatedOptions<TDTO>): Promise<IPaginatedResults<TDTO>> {
    try {
      const page = options?.page ?? 1
      const limit = options?.limit ?? 10

      const whereClause = options?.query ? options.query : {}

      const offset = (page - 1) * limit

      // 🔽 Transformar Record<keyof TDTO, Direction> en [['field', 'ASC']]
      const orderClause = options?.order
        ? (Object.entries(options.order).map(([field, dir]) => [
          field,
          dir === 1 ? 'ASC' : dir === -1 ? 'DESC' : dir
        ]) as Array<[string, 'ASC' | 'DESC']>)
        : undefined

      const { rows, count } = await this.Model.findAndCountAll({
        where: whereClause,
        offset,
        limit,
        distinct: true,
        order: orderClause
        // order: options?.order ? [[options.order?.field as string, options.order?.direction]] as Order : undefined
      })

      const data = count === 0 ? this.emptyObject as TDTO[] : rows.map(this.parserFn)
      return {
        message: `Total registros: ${count}. ${this.Model.name}s obtenidos correctamente `,
        info: {
          total: count,
          page,
          limit,
          totalPages: Math.ceil(count / limit)
        },
        data

      }
    } catch (error) {
      return processError(error, `GetWithPages ${this.Model.name} repository error`)
    }
  }

  async getById(id: string | number): Promise<IRepositoryResponse<TDTO>> {
    try {
      const model = await this.Model.findByPk(id)
      if (!model) throwError(`${this.Model.name} no encontrado`, 404)
      return {
        message: `${this.Model.name} registro obtenido correctamente`,
        results: this.parserFn(model!)
      }
    } catch (error) {
      return processError(error, `GetById ${this.Model.name} repository error`)
    }
  }

  async getByField(
    field?: unknown,
    whereField: keyof TDTO | string = this.whereField
  ): Promise<IRepositoryResponse<TDTO>> {
    try {
      if (field == null) throwError(`No hay valor proporcionado para ${whereField.toString()}`, 400)
      const model = await this.Model.findOne({
        where: { [whereField]: field } as any
      })
      if (!model) throwError(`El ${whereField.toString()} "${field}" no se encontro`, 404)
      return {
        message: `${this.Model.name} registro obtenido correctamente`,
        results: this.parserFn(model!)
      }
    } catch (error) {
      return processError(error, `GetByField ${this.Model.name} repository error`)
    }
  }

  async create(data: TCreate): Promise<IRepositoryResponse<TDTO>> {
    try {
      const exists = await this.Model.findOne({
        where: { [this.whereField]: (data as any)[this.whereField] } as any
      })
      if (exists) {
        throwError(
          `${this.Model.name} with ${this.whereField} ${(data as any)[this.whereField]} already exists`,
          400
        )
      }
      const model = await this.Model.create(data as any)
      return {
        message: `${this.Model.name} ${(data as any)[this.whereField]} creado correctamente`,
        results: this.parserFn(model)
      }
    } catch (error) {
      return processError(error, `Create ${this.Model.name} repository error`)
    }
  }

  async update(id: string | number, data: TUpdate): Promise<IRepositoryResponse<TDTO>> {
    try {
      const model = await this.Model.findByPk(id)
      if (!model) throwError(`${this.Model.name} no encontrado`, 404)
      const updated = await model!.update(data as Partial<TDTO>)
      return {
        message: `${this.Model.name} registro actualizado correctamente`,
        results: this.parserFn(updated)
      }
    } catch (error) {
      return processError(error, `Update ${this.Model.name} repository error`)
    }
  }

  async delete(id: string | number): Promise<IRepositoryResponse<string>> {
    try {
      const model = await this.Model.findByPk(id)
      if (!model) throwError(`${this.Model.name} no encontrado`, 404)
      const value = (model as any)[this.whereField]
      await model!.destroy()
      return {
        message: `${value} eliminado correctamente`,
        results: ''
      }
    } catch (error) {
      return processError(error, `Delete ${this.Model.name} repository error`)
    }
  }

  async getAllScoped(scope: string): Promise<IRepositoryResponse<TDTO[]>> {
    try {
      const models = await this.Model.scope(scope).findAll()
      if (models.length === 0) {
        return {
          message: `${this.Model.name} no contiene datos`,
          results: this.emptyObject as TDTO[]
        }
      }
      return {
        message: `${this.modelName} registros obtenidos correctamente con scope ${scope}`,
        results: models.map(this.parserFn)
      }
    } catch (error) {
      return processError(error, `GetAllScoped ${this.Model.name} repository error`)
    }
  }

  async getByIdScoped(id: string | number, scope: string): Promise<IRepositoryResponse<TDTO>> {
    try {
      const model = await this.Model.scope(scope).findByPk(id)
      if (!model) throwError(`${this.modelName} no encontrado o no disponible con scope ${scope}`, 404)
      return {
        message: `${this.modelName} registro obtenido correctamente con scope ${scope}`,
        results: this.parserFn(model!)
      }
    } catch (error) {
      return processError(error, `GetByIdScoped ${this.Model.name} repository error`)
    }
  }
}
