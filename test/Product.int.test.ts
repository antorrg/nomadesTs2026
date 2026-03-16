import { describe, it, expect, beforeAll } from 'vitest'
import { agent, getCsrfToken } from './testHelpers/sharedAgent.help.js'
import fs from 'fs/promises'
import path from 'path'

export const productTests = () => {
    describe('INTEGRATION TEST - "/api/v1/product"', () => {
        let productId: number
        let itemId: number
        const uploadDir = 'serverAssets/uploads'

        const fileExists = async (filename: string) => {
            try {
                await fs.access(path.join(uploadDir, filename))
                return true
            } catch {
                return false
            }
        }

        beforeAll(async () => {
            // Asegurar que la carpeta existe
            await fs.mkdir(uploadDir, { recursive: true })

            // Limpiar archivos previos para evitar falsos positivos
            const existingFiles = await fs.readdir(uploadDir)
            for (const file of existingFiles) {
                await fs.unlink(path.join(uploadDir, file))
            }

            // Crear archivos de imagen ficticios
            const files = ['product.png', 'item.png', 'updated.png', 'second.png', 'updated_item.png', 'delete_prod.png', 'delete_item.png']
            for (const file of files) {
                await fs.writeFile(path.join(uploadDir, file), 'fake image content')
            }
        })

        describe('Public Routes', () => {
            it('GET /public - should retrieve all enabled products', async () => {
                const response = await agent.get('/api/v1/product/public')
                expect(response.status).toBe(200)
                expect(response.body.success).toBe(true)
                expect(Array.isArray(response.body.results)).toBe(true)
            })
        })

        describe('Authenticated Product Routes', () => {
            it('POST / - should create a new product and consume images', async () => {
                const data = {
                    title: 'Test Product',
                    picture: 'product.png',
                    info_header: 'Info Header',
                    info_body: 'Info Body',
                    useImg: true, // Esto debería activar el borrado de 'product.png'
                    items: [
                        { text: 'Initial Item', picture: 'item.png', useImg: true } // Borraría 'item.png'
                    ]
                }
                const response = await agent
                    .post('/api/v1/product')
                    .set('x-xsrf-token', getCsrfToken())
                    .send(data)

                expect(response.status).toBe(201)
                expect(response.body.results.title).toBe('Test Product')
                productId = response.body.results.id
                itemId = response.body.results.Items && response.body.results.Items[0] ? response.body.results.Items[0].id : null

                // Verificar que las imágenes fueron "consumidas" (borradas de uploads)
                expect(await fileExists('product.png')).toBe(false)
                expect(await fileExists('item.png')).toBe(false)
            }, 10000)

            it('GET /:id - should retrieve product by ID', async () => {
                const response = await agent.get(`/api/v1/product/${productId}`)
                expect(response.status).toBe(200)
                expect(response.body.results.id).toBe(productId)
            })

            it('PUT /:id - should update product and handle old image (saver: false)', async () => {
                const data = {
                    title: 'Updated Product',
                    enabled: true,
                    picture: 'updated.png',
                    info_header: 'Updated Header',
                    info_body: 'Updated Body',
                    useImg: true,
                    saver: false
                }
                const response = await agent
                    .put(`/api/v1/product/${productId}`)
                    .set('x-xsrf-token', getCsrfToken())
                    .send(data)

                expect(response.status).toBe(200)
                expect(response.body.results.title).toBe('Updated Product')
                expect(await fileExists('updated.png')).toBe(false)
            }, 10000)
        })

        describe('Authenticated Item Routes', () => {
            it('POST /item - should create a new item and consume image', async () => {
                const data = {
                    text: 'Second Item',
                    picture: 'second.png',
                    ProductId: productId,
                    useImg: true
                }
                const response = await agent
                    .post('/api/v1/product/item')
                    .set('x-xsrf-token', getCsrfToken())
                    .send(data)

                expect(response.status).toBe(201)
                expect(response.body.results.text).toBe('Second Item')
                expect(await fileExists('second.png')).toBe(false)
                if (!itemId) itemId = response.body.results.id
            }, 10000)

            it('PUT /item/:id - should update item and handle old image (saver: true)', async () => {
                const data = {
                    text: 'Updated Item',
                    enabled: true,
                    picture: 'updated_item.png',
                    useImg: true,
                    saver: true
                }
                const response = await agent
                    .put(`/api/v1/product/item/${itemId}`)
                    .set('x-xsrf-token', getCsrfToken())
                    .send(data)

                expect(response.status).toBe(200)
                expect(response.body.results.text).toBe('Updated Item')
                expect(await fileExists('updated_item.png')).toBe(false)
            }, 10000)
        })

        describe('Deletion Routes (Cleanup verification)', () => {
            it('DELETE /item/:id - should delete an item and its image', async () => {
                // Creamos un item específico para este test
                const itemData = {
                    ProductId: productId,
                    text: 'Item to delete',
                    picture: 'delete_this_item.png',
                    useImg: false
                }
                await fs.writeFile(path.join(uploadDir, 'delete_this_item.png'), 'fake image content')

                const createRes = await agent
                    .post('/api/v1/product/item')
                    .set('x-xsrf-token', getCsrfToken())
                    .send(itemData)

                const deleteItemId = createRes.body.results.id
                expect(await fileExists('delete_this_item.png')).toBe(true)

                const response = await agent
                    .delete(`/api/v1/product/item/${deleteItemId}`)
                    .set('x-xsrf-token', getCsrfToken())

                expect(response.status).toBe(200)
                expect(await fileExists('delete_this_item.png')).toBe(false)
            }, 10000)

            it('DELETE /:id - should delete a product and all associated images (product + remaining items)', async () => {
                // Creamos un nuevo producto con items para probar la limpieza en cascada
                const complexData = {
                    title: 'Delete Me',
                    picture: 'delete_prod.png',
                    info_header: 'H',
                    info_body: 'B',
                    useImg: false,
                    items: [{ text: 'Cascade item', picture: 'cascade_item.png', useImg: false }]
                }
                await fs.writeFile(path.join(uploadDir, 'delete_prod.png'), 'content')
                await fs.writeFile(path.join(uploadDir, 'cascade_item.png'), 'content')

                const createRes = await agent
                    .post('/api/v1/product')
                    .set('x-xsrf-token', getCsrfToken())
                    .send(complexData)

                expect(createRes.status).toBe(201)
                const newProductId = createRes.body.results.id

                expect(await fileExists('delete_prod.png')).toBe(true)
                expect(await fileExists('cascade_item.png')).toBe(true)

                const response = await agent
                    .delete(`/api/v1/product/${newProductId}`)
                    .set('x-xsrf-token', getCsrfToken())

                expect(response.status).toBe(200)
                expect(await fileExists('delete_prod.png')).toBe(false)
                expect(await fileExists('cascade_item.png')).toBe(false)
            }, 15000)
        })
    })
}
