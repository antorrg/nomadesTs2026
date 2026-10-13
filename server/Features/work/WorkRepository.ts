import { BaseRepository } from "../../Shared/Repositories/BaseRepository.js";
import { QueryTypes } from 'sequelize'
import { sequelize, Work } from '../../Configs/database.js'
import { processError } from '../../Configs/errorHandlers.js'
import type { IRepositoryResponse } from '../../Shared/Interfaces/base.interface.js'
import { parser, parserQuery, mockData, type IWork } from './/workMappers.js'

export class WorkRepository extends BaseRepository<IWork , Partial<IWork>> {
  constructor() {
    super(Work, parser, parserQuery, 'work', 'title', mockData)
  }

  override async getAllScoped(): Promise<IRepositoryResponse<IWork[]>> {
    try {
      const tableName = this.Model.getTableName()
      const models = await sequelize.query(
        `SELECT * FROM ${tableName}
        WHERE enabled = true
        ORDER BY "id" ASC;
        `,
        { type: QueryTypes.SELECT }
      )

      if (models.length === 0) {
        return {
          message: `El registro no contiene datos`,
          results: this.emptyObject
            ? Array.isArray(this.emptyObject) ? this.emptyObject : [this.emptyObject]
            : []
        }
      }

      const data = models.map(parserQuery)
      return {
        message: `${data.length} registros obtenidos correctamente`,
        results: data
      }
    } catch (error) {
      return processError(error, `GetAllScoped ${this.Model.name} repository error`)
    }
  }
}