import { type Model } from "sequelize"
import { type IRepositoryResponse } from "../../Shared/Interfaces/base.interface.js"

export interface IItem {
    id: number
    picture: string | null
    text: string | null
    ProductId: number
    enabled: boolean
}

export type CreateItemInProduct = Omit<IItem, 'id' | 'enabled' | 'ProductId'> & { useImg?: boolean }
export type CreateItem = Omit<IItem, 'id' | 'enabled'> & { useImg?: boolean }
export type UpdateItem = Partial<Omit<IItem, 'id'>> & { useImg?: boolean; saver?: boolean }

export interface IProduct {
    id: number
    title: string | null
    picture: string | null
    info_header: string | null
    info_body: string | null
    enabled: boolean
    Items?: IItem[]
}

export type CreateProduct = Omit<IProduct, 'id' | 'enabled' | 'Items'> & {
    items: CreateItemInProduct[]
    useImg?: boolean
}

export type UpdateProduct = Partial<Omit<IProduct, 'id' | 'Items'>> & {
    useImg?: boolean
    saver?: boolean
}
export type ProductsResponse = Omit<IProduct, 'Items'>
type ItemRaw = IItem
type ProductRaw = IProduct
type Parseable<T> = T | Model

export interface IProductRepository {
    getProducts: () => Promise<IRepositoryResponse<ProductsResponse[]>>
    getProductById: (id: number) => Promise<IRepositoryResponse<IProduct>>
    deleteProduct: (id: number) => Promise<IRepositoryResponse<string>>
    createItem: (data: CreateItem) => Promise<IRepositoryResponse<IItem>>
    updateItem: (id: number, data: UpdateItem) => Promise<IRepositoryResponse<IItem>>
    deleteItem: (id: number) => Promise<IRepositoryResponse<string>>
    getByIdScoped: (id: number) => Promise<IRepositoryResponse<IProduct>>
    getItemScoped: (id: number) => Promise<IRepositoryResponse<IItem>>
}

export class ItemParser {
    static toDTO(i: Parseable<ItemRaw>, short: boolean= false): IItem {
        const raw = toRaw<ItemRaw>(i)
        
        return {
            id: raw.id,
            picture: raw.picture,
            text: short===false? raw.text : truncateText(raw.text, 4) ,
            ProductId: raw.ProductId,
            enabled: raw.enabled
        }
    }
}

export class ProductParser {
    static toDetailDTO(p: Parseable<ProductRaw>): IProduct {
        const raw = toRaw<ProductRaw>(p)
        return {
            id: raw.id,
            title: raw.title,
            picture: raw.picture,
            info_header: raw.info_header,
            info_body: raw.info_body,
            enabled: raw.enabled,
            Items: raw.Items ? raw.Items.map((item) => ItemParser.toDTO(item, true)) : undefined
        }
    }
       static toDetailQuery(data: unknown): IProduct {
        const raw = data as ProductRaw
        return {
            id: raw.id,
            title: raw.title,
            picture: raw.picture,
            info_header: raw.info_header,
            info_body: raw.info_body,
            enabled: raw.enabled,
            Items: raw.Items ? raw.Items.map((item) => ItemParser.toDTO(item, true)) : undefined
        }
    }

    static toListDTO(p: Parseable<ProductRaw>): ProductsResponse {
        const raw = toRaw<ProductRaw>(p)
        return {
            id: raw.id,
            title: raw.title,
            picture: raw.picture,
            info_header: raw.info_header,
            info_body: raw.info_body,
            enabled: raw.enabled
        }
    }
        static toListQuery(data: unknown): ProductsResponse {
        const raw = data as ProductRaw
        return {
            id: raw.id,
            title: raw.title,
            picture: raw.picture,
            info_header: raw.info_header,
            info_body: raw.info_body,
            enabled: raw.enabled
        }
    }
}

export const mockProduct: ProductsResponse[] = [{
    id: 0,
    title: 'No hay datos',
    picture: null,
    info_header: 'No hay datos',
    info_body: 'No hay datos',
    enabled: true
}]

const truncateText = (text: string | null, wordLimit = 10): string | null => {
  if (!text) return text
  const words = text.split(' ') // Ejemplo de uso
  if (words.length <= wordLimit) { //   const text = "Texto de ejemplo";
    return text
  } //   const ejemplo = truncateText(text, 12);
  const truncatedWords = words.slice(0, wordLimit)
  return truncatedWords.join(' ') + '...'
}

const toRaw = <T>(value: Parseable<T>): T => {
    if (isSequelizeModel(value)) {
        return value.get({ plain: true }) as T
    }
    return value
}

const isSequelizeModel = (value: unknown): value is Model => (
    typeof value === 'object' &&
    value !== null &&
    'get' in value &&
    typeof (value as { get: unknown }).get === 'function'
)
