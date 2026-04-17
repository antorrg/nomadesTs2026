import { type Images, type CreateImages, type ImagesRepository } from './Images.interface.js'
import type { Model, ModelStatic } from 'sequelize'
import { throwError } from '../../Configs/errorHandlers.js'
import logger from '../../Configs/logger.js'

export class ImageRepository<Images, CreateImages> implements ImagesRepository<Images, CreateImages> {
    constructor(
        protected readonly model: ModelStatic<Model>,
        private readonly parserFn: (model: Model) => Images,
    ) {
        this.model = model
        this.parserFn = parserFn
    }
    static #dataParsed = (info: string | number): string | number => {
        if (info === 'L') { throwError('No puede eliminarse, imagen referencial', 404) }
        return info
    }
    async saveImage(data: CreateImages): Promise<Images> {
        try {
            const { imageUrl } = data as any
            const image = await this.model.findOne({ where: { imageUrl } })
            if (image) throwError('Esta imagen ya fue guardada', 400)

            const docRef = await this.model.create({
                imageUrl
            })
            if (!docRef) {
                throwError('Error guardando imagen', 500)
            }
            return this.parserFn(docRef)
        } catch (error) {
            logger.error(error)
            throw error
        }
    }
    async getImages(): Promise<Images[]> {
        try {
            const images = await this.model.findAll()
            if (!images) { throwError('Error de servidor en images', 500) }
            if (images.length === 0) { return [{ id: 'L', imageUrl: 'https://res.cloudinary.com/dt1lpgumr/image/upload/c_scale,w_auto/f_auto,q_auto/roja13.webp?_a=BAMAH2TE0' } as Images] }

            return images.map(img => this.parserFn(img))
        } catch (error) {
            logger.error(error)
            throw error
        }
    }
    
        async deleteImageFromDbById(id: string | number): Promise<string> {
        try {
            let imgResult: string
            const image = await this.model.findByPk(ImageRepository.#dataParsed(id))
                imgResult = image!.get().imageUrl
                await image!.destroy()
                logger.info('imagen borrada')
                return imgResult 
        } catch (error) {
            logger.error(`Error elminando imagen`);
            throw error
        }
    }
        async deleteImageFromDbByUrl(dataImage: string | number, isId: boolean = false): Promise<string> {
        try {
            const image = await this.model.findOne({ where: { imageUrl: ImageRepository.#dataParsed(dataImage) } })
                if (!image) { throwError('Imagen no hallada', 404) }
                await image!.destroy()
                logger.info('imagen borrada')
                return dataImage as string
        } catch (error) {
            logger.error(`Error elminando imagen`);
            throw error
        }
    }
}
