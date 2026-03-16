import { beforeAll, afterAll, describe, it, expect } from 'vitest'
import { startUp, closeDatabase } from '../../Configs/database.js'
import { ProductRepository } from './ProductRepository.js'
import { mockProduct, type CreateProduct } from './ProductMappers.js'

describe('ProductRepository Integration Tests', () => {
    let repo: ProductRepository

    beforeAll(async () => {
        // Inicializamos la base de datos de test (sync y force rewrite)
        await startUp(true, true)
        repo = new ProductRepository(mockProduct as any)
    })

    afterAll(async () => {
        await closeDatabase()
    })

    describe('Product Aggregate - Atomic Creation', () => {
        it('should create a product with items in a single transaction', async () => {
            const data: CreateProduct = {
                title: 'Test Product',
                picture: 'prod-pic.jpg',
                info_header: 'Header',
                info_body: 'Body',
                items: [
                    { text: 'Item 1', picture: 'pic1.jpg' },
                    { text: 'Item 2', picture: 'pic2.jpg' }
                ]
            }

            const response = await repo.createProduct(data)

            expect(response.message).toBe('Product retrieved successfully')
            expect(response.results.title).toBe('Test Product')
            expect(response.results.Items).toHaveLength(2)
            expect(response.results.Items![0].text).toBe('Item 1')
            expect(response.results.Items![0].ProductId).toBe(response.results.id)
        })

        it('should rollback product creation if items are invalid', async () => {
            const initialProducts = await repo.getProducts()
            const initialCount = initialProducts.results.length

            const data: any = {
                title: 'Faulty Product',
                items: [
                    { text: null, picture: {} } // Esto debería fallar en la DB o validación
                ]
            }

            try {
                await repo.createProduct(data)
            } catch (error) {
                // Se espera error
            }

            const afterProducts = await repo.getProducts()
            expect(afterProducts.results.length).toBe(initialCount)
        })
    })

    describe('Read Operations - List vs Detail', () => {
        it('should return products without items in list view', async () => {
            const response = await repo.getProducts()
            expect(response.results.length).toBeGreaterThan(0)
            expect(response.results[0]).not.toHaveProperty('Items')
        })

        it('should return product with items in detail view', async () => {
            const all = await repo.getProducts()
            const id = all.results[0].id

            const response = await repo.getProductById(id)
            expect(response.results.id).toBe(id)
            expect(response.results).toHaveProperty('Items')
            expect(Array.isArray(response.results.Items)).toBe(true)
        })
    })

    describe('Update and Delete', () => {
        it('should update product fields', async () => {
            const all = await repo.getProducts()
            const id = all.results[0].id

            const response = await repo.updateProduct(id, { title: 'Updated Title' })
            expect(response.results.title).toBe('Updated Title')
        })

        it('should delete product and its items (Cascade)', async () => {
            const data: CreateProduct = {
                title: 'To Be Deleted',
                picture: null,
                info_header: null,
                info_body: null,
                items: [{ text: 'Will be gone', picture: null }]
            }
            const created = await repo.createProduct(data)
            const productId = created.results.id
            const itemId = created.results.Items![0].id

            await repo.deleteProduct(productId)

            // Verificar que el producto no existe
            const productRes = await repo.getProducts()
            expect(productRes.results.find(p => p.id === productId)).toBeUndefined()

            // Verificar que el ítem no existe (getItem debe lanzar error)
            await expect(repo.getItem(itemId)).rejects.toThrow('Item not found')
        })
    })

    describe('Individual Item Management', () => {
        it('should create an individual item for an existing product', async () => {
            const all = await repo.getProducts()
            const productId = all.results[0].id

            const response = await repo.createItem({
                text: 'New Single Item',
                picture: null,
                ProductId: productId
            })

            expect(response.results.text).toBe('New Single Item')
            expect(response.results.ProductId).toBe(productId)
        })

        it('should update and delete an individual item', async () => {
            const all = await repo.getProducts()
            const product = await repo.getProductById(all.results[0].id)
            const itemId = product.results.Items![0].id

            const updateRes = await repo.updateItem(itemId, { text: 'Updated Item' })
            expect(updateRes.results.text).toBe('Updated Item')

            await repo.deleteItem(itemId)
            await expect(repo.getItem(itemId)).rejects.toThrow('Item not found')
        })
    })
})
