import { BaseService } from '../../Shared/Services/BaseService.js'
import { BaseRepository } from '../../Shared/Repositories/BaseRepository.js'
import type { IRepositoryResponse } from '../../Shared/Interfaces/base.interface.js'
import type { IMedia, CreateMedia, UpdateMedia, IMediaConfig, CreateMediaConfig, UpdateMediaConfig } from './mediaMappers.js'

export class MediaService extends BaseService<IMedia, CreateMedia, UpdateMedia> {
  protected configRepository: BaseRepository<IMediaConfig, CreateMediaConfig, UpdateMediaConfig>

  constructor(
    repository: BaseRepository<IMedia, CreateMedia, UpdateMedia>,
    configRepository: BaseRepository<IMediaConfig, CreateMediaConfig, UpdateMediaConfig>
  ) {
    super(repository)
    this.configRepository = configRepository
  }

  async getConfig(): Promise<IMediaConfig> {
    const { results } = await this.configRepository.getAll()
    if (results && Array.isArray(results) && results.length > 0) {
      return results[0]
    }
    const created = await this.configRepository.create({
      showFacebook: true,
      showInstagram: true,
      showYouTube: true
    })
    return created.results as IMediaConfig
  }

  override async getAll(field?: unknown, whereField?: keyof IMedia | string): Promise<IRepositoryResponse<IMedia[]>> {
    const mediaResponse = await super.getAll(field, whereField)
    const config = await this.getConfig()

    const configItem: IMedia = {
      id: config.id,
      type: 'config',
      title: 'config',
      enabled: true,
      showFacebook: config.showFacebook,
      showInstagram: config.showInstagram,
      showYouTube: config.showYouTube
    }

    const items = Array.isArray(mediaResponse.results) ? mediaResponse.results : []
    return {
      ...mediaResponse,
      results: [...items, configItem]
    }
  }

  override async getAllScoped(): Promise<IRepositoryResponse<IMedia[]>> {
    const mediaResponse = await super.getAllScoped()
    const config = await this.getConfig()

    const configItem: IMedia = {
      id: config.id,
      type: 'config',
      title: 'config',
      enabled: true,
      showFacebook: config.showFacebook,
      showInstagram: config.showInstagram,
      showYouTube: config.showYouTube
    }

    const items = Array.isArray(mediaResponse.results) ? mediaResponse.results : []
    return {
      ...mediaResponse,
      results: [...items, configItem]
    }
  }

  async updateConfig(data: UpdateMediaConfig): Promise<IRepositoryResponse<IMediaConfig>> {
    const config = await this.getConfig()
    return await this.configRepository.update(config.id, data)
  }
}