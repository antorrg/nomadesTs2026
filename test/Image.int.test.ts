import { describe, it, expect, beforeAll } from 'vitest'
import { agent, getCsrfToken } from './testHelpers/sharedAgent.help.js'
import fs from 'fs/promises'
import path from 'path'
import envConfig from '../server/Configs/envConfig.js'

export const imageTests = () => {
    describe('INTEGRATION TEST - "/api/v1/images"', () => {
        let uploadedUrl: string
        const uploadDir = envConfig.TestImagesUploadDir

        const fileExists = async (filename: string) => {
            try {
                await fs.access(path.join(uploadDir, filename))
                return true
            } catch {
                return false
            }
        }

        beforeAll(async () => {
            await fs.mkdir(uploadDir, { recursive: true })
        })

        describe('POST /upload', () => {
            it('should upload an image and return its URL', async () => {
                const buffer = Buffer.from('fake image content')
                const filename = 'upload_test.png'

                const response = await agent
                    .post('/api/v1/images/upload')
                    .set('x-xsrf-token', getCsrfToken())
                    .attach('image', buffer, filename)

                expect(response.status).toBe(200)
                expect(response.body.results.url).toBeDefined()
                uploadedUrl = response.body.results.url

                // Verificar que el archivo existe físicamente
                const diskFilename = path.basename(uploadedUrl)
                expect(await fileExists(diskFilename)).toBe(true)
            })

            it('should return 500 if no image is provided', async () => {
                const response = await agent
                    .post('/api/v1/images/upload')
                    .set('x-xsrf-token', getCsrfToken())

                // Según ImageController.ts:23-25 lanza throwError('No se subió ningún archivo', 500)
                expect(response.status).toBe(500)
            })
        })

        describe('GET /', () => {
            it('should retrieve list of images (if implemented in repo)', async () => {
                const response = await agent
                    .get('/api/v1/images')
                    .set('x-xsrf-token', getCsrfToken())

                expect(response.status).toBe(200)
                expect(response.body.success).toBe(true)
                expect(Array.isArray(response.body.results)).toBe(true)
            })
        })

        describe('DELETE /:id', () => {
            beforeAll(async () => {
                // Guardar en DB para que el borrado tenga éxito en el repositorio
                await agent
                    .post('/api/v1/images/save')
                    .set('x-xsrf-token', getCsrfToken())
                    .send({ imageUrl: uploadedUrl })
            })

            it('should delete an image by its URL (encoded)', async () => {
                const id = encodeURIComponent(uploadedUrl)

                const response = await agent
                    .delete(`/api/v1/images/${id}`)
                    .set('x-xsrf-token', getCsrfToken())

                expect(response.status).toBe(200)
                expect(response.body.success).toBe(true)
                expect(response.body.message).toBe('Imagen eliminada exitosamente')

                // Verificar que el archivo ya no existe
                const diskFilename = path.basename(uploadedUrl)
                expect(await fileExists(diskFilename)).toBe(false)
            }, 10000)

            it('should handle partial errors (e.g. file missing on disk but present in DB or viceversa)', async () => {
                const response = await agent
                    .delete('/api/v1/images/non_existent.png')
                    .set('x-xsrf-token', getCsrfToken())

                // Repo fallará con 404, MockImgsService devolverá éxito (idempotencia)
                // Pero como solo hay 1 tarea (ImgsService.deleteImage) y falla en repo,
                // total tareas = 1, errores = 1 -> Error total (500)
                expect(response.status).toBe(500)
            })

        })

    })
}
