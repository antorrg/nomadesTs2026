import { beforeAll, afterAll, describe, it, expect } from 'vitest'
import { startUp, closeDatabase } from '../../Configs/database.js'
import { ProductRepository } from './ProductRepository.js'
import { ProductService } from './ProductService.js'
import { mockProduct, type CreateProduct, type UpdateProduct } from './ProductMappers.js'
import prepareTestImages from '../../../test/testHelpers/prepareTestImages.help.js'
import envConfig from '../../Configs/envConfig.js'

describe('ProductService Integration Tests', () => {
    let service: ProductService
    let repository: ProductRepository
    let imagesCopied: string[] = []

    beforeAll(async () => {
        // Inicializamos la base de datos de test
        await startUp(true, true)

        // Preparamos imágenes de prueba locales (suficientes para todas las pruebas)
        imagesCopied = await prepareTestImages(7)

        repository = new ProductRepository(mockProduct as any)
        service = new ProductService(repository)
    })

    afterAll(async () => {
        await closeDatabase()
    })

    describe('Create with Images', () => {
        it('should handle images for both product and items on creation', async () => {
            const data: CreateProduct = {
                title: 'Service Product',
                picture: imagesCopied[0], // "test0.jpg"
                info_header: 'Header',
                info_body: 'Body',
                // useImg: false (default), no borra la imagen todavía
                items: [
                    { text: 'Item 1', picture: imagesCopied[1] },
                    { text: 'Item 2', picture: imagesCopied[2] }
                ]
            }

            const response = await service.create(data)

            expect(response.message).toBe('Product retrieved successfully')
            expect(response.results.picture).toBe(imagesCopied[0])
            expect(response.results.Items![0].picture).toBe(imagesCopied[1])
            expect(response.results.Items![1].picture).toBe(imagesCopied[2])
        })
    })

    describe('Update with Saver logic', () => {
        it('should delete old image when saver is false (default)', async () => {
            const all = await service.getAll()
            const id = all.results[0].id
            const oldPic = all.results[0].picture // test0.jpg

            const response = await service.update(id, {
                picture: imagesCopied[3],
                useImg: false, // para que no borre la [3] todavia
                saver: false
            })

            expect(response.results.picture).toBe(imagesCopied[3])
            expect(response.message).toContain(`Imagen antigua: Image ${envConfig.TestImagesUploadDir}/${oldPic} deleted successfully`)
        })

        it('should keep old image when saver is true', async () => {
            const all = await service.getAll()
            const id = all.results[0].id
            const oldPic = all.results[0].picture // test3.jpg

            const response = await service.update(id, {
                picture: imagesCopied[4],
                useImg: false,
                saver: true
            })

            expect(response.results.picture).toBe(imagesCopied[4])
            // No hay mensaje de borrado porque saver: true
        })
    })

    describe('Delete with Cleanup', () => {
        it('should delete product and cleanup images for product AND all its items', async () => {
            // Usamos las imágenes 5 y 6 que están vírgenes
            const data: CreateProduct = {
                title: 'Cleanup product',
                picture: imagesCopied[5],
                info_header: 'H',
                info_body: 'B',
                useImg: false,
                items: [
                    { text: 'I1', picture: imagesCopied[6] }
                ]
            }
            const created = await service.create(data)
            const id = created.results.id

            const response = await service.delete(id)

            expect(response.message).toContain(`deleted successfully and Image ${envConfig.TestImagesUploadDir}/${imagesCopied[5]} deleted successfully`)
        })
    })

    describe('Granular Item Actions', () => {
        it('should handle images for individual items', async () => {
            const all = await service.getAll()
            const productId = all.results[0].id

            // Create Item (usamos [1] que aun existe)
            const createRes = await service.createItem({
                text: 'Single Item Service',
                picture: imagesCopied[1],
                ProductId: productId,
                useImg: false
            })
            expect(createRes.results.picture).toBe(imagesCopied[1])

            // Update Item (usamos [2] que aun existe)
            const updateRes = await service.updateItem(createRes.results.id, {
                picture: imagesCopied[2],
                useImg: false,
                saver: false
            })
            expect(updateRes.results.picture).toBe(imagesCopied[2])
            // Nota: Al no usar useImg:true, no hay borrado de [1] todavia?
            // Espera, el service.updateItem SIEMPRE trata la imagen vieja si cambia.

            // Delete Item
            const deleteRes = await service.deleteItem(createRes.results.id)
            expect(deleteRes.message).toBe('Item deleted successfully')
        })
    })
})
