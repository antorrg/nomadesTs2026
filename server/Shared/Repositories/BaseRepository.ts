import { type CreationAttributes, type Model, type ModelStatic, type WhereOptions } from 'sequelize'
import {sequelize } from '../../Configs/database.js'
import {QueryTypes} from 'sequelize'
import type { IBaseRepository, IRepositoryResponse, IPaginatedOptions, IPaginatedResults } from '../Interfaces/base.interface.js'
import { throwError, processError } from '../../Configs/errorHandlers.js'

export class BaseRepository<
  TDTO, TCreate, TUpdate = Partial<TCreate>,
> implements IBaseRepository<TDTO, TCreate, TUpdate> {
  protected readonly Model: ModelStatic<Model>
  private readonly parserFn: (model: Model) => TDTO
  private readonly parserQuery: (model: unknown) => TDTO
  private readonly modelName: string
  private readonly whereField: keyof TDTO & string
  protected readonly emptyObject?: TDTO | TDTO[] | null

  constructor(
    Model: ModelStatic<Model>,
    parserFn: (model: Model) => TDTO,
    parserQueryOrModelName: ((model: unknown) => TDTO) | string,
    modelNameOrWhereField: string,
    whereFieldOrEmptyObject?: (keyof TDTO & string) | TDTO | TDTO[] | null,
    emptyObject?: TDTO | TDTO[] | null
  ) {
    this.Model = Model
    this.parserFn = parserFn

    if (typeof parserQueryOrModelName === 'function') {
      this.parserQuery = parserQueryOrModelName
      this.modelName = modelNameOrWhereField
      this.whereField = whereFieldOrEmptyObject as keyof TDTO & string
      this.emptyObject = emptyObject
    } else {
      this.parserQuery = (model: unknown) => this.parserFn(model as Model)
      this.modelName = parserQueryOrModelName
      this.whereField = modelNameOrWhereField as keyof TDTO & string
      this.emptyObject = whereFieldOrEmptyObject as TDTO | TDTO[] | null | undefined
    }
  }

  async getAll(field?: unknown, whereField?: keyof TDTO | string): Promise<IRepositoryResponse<TDTO[]>> {
    try {
      const whereClause = (field && whereField) ? { [whereField]: field } : {}
      const models = await this.Model.findAll({ where: whereClause })

      if (models.length === 0) {
        return {
          message: `${this.Model.name} no contiene datos`,
          results: this.emptyResults()
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

      const data = count === 0 ? this.emptyResults() : rows.map(this.parserFn)
      return {
        message: `Total registros: ${count}. ${this.Model.name}s obtenidos correctamente`,
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
        where: { [whereField]: field } as WhereOptions
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
      const uniqueValue = this.getCreateValue(data)
      const exists = await this.Model.findOne({
        where: { [this.whereField]: uniqueValue } as WhereOptions
      })
      if (exists) {
        throwError(
          `${this.Model.name} with ${this.whereField} ${uniqueValue} already exists`,
          400
        )
      }
      const model = await this.Model.create(data as CreationAttributes<Model>)
      return {
        message: `${this.Model.name} ${uniqueValue} creado correctamente`,
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
      const value = model!.get(this.whereField)
      await model!.destroy()
      return {
        message: `${value} eliminado correctamente`,
        results: ''
      }
    } catch (error) {
      return processError(error, `Delete ${this.Model.name} repository error`)
    }
  }

  async getAllScoped(): Promise<IRepositoryResponse<TDTO[]>> {
    try {
      const tableName = this.Model.getTableName()
      const models = await sequelize.query(
        `SELECT * FROM ${tableName}
        WHERE enabled = true;
        `,
        { type: QueryTypes.SELECT }
      )
      if (models.length === 0) {
        return {
          message: `${this.Model.name} no contiene datos`,
          results: this.emptyResults()
        }
      }
      return {
        message: `${this.modelName} registros obtenidos correctamente`,
        results: models.map(this.parserQuery)
      }
    } catch (error) {
      return processError(error, `GetAllScoped ${this.Model.name} repository error`)
    }
  }

  async getByIdScoped(id: string | number): Promise<IRepositoryResponse<TDTO>> {
    try {
      const tableName = this.Model.getTableName()
      const [model] = await sequelize.query(
        `SELECT * FROM ${tableName}
         WHERE enabled = true
         AND id = :id
        `,
        {
          replacements: { id },
          type: QueryTypes.SELECT
        }
      )
      if (!model) throwError(`${this.modelName} no encontrado o no disponible`, 404)
      return {
        message: `${this.modelName} registro obtenido correctamente`,
        results: this.parserQuery(model)
      }
    } catch (error) {
      return processError(error, `GetByIdScoped ${this.Model.name} repository error`)
    }
  }

  private getCreateValue(data: TCreate): unknown {
    return (data as Record<string, unknown>)[this.whereField]
  }

  private emptyResults(): TDTO[] {
    if (!this.emptyObject) return []
    return Array.isArray(this.emptyObject) ? this.emptyObject : [this.emptyObject]
  }
}
