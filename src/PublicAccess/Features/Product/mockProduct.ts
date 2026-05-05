    import type { IProduct } from "../../../types/product"
    
    export const mockProductWithItem:IProduct = {
    id: 0,
    title: 'Aguardando informacion',
    info_header: 'Aguardando informacion...',
    info_body: 'Aguardando informacion...',
    picture: `/base.jpg`,
    enabled: true,
    Items: [
      {
        id: 0,
        ProductId:0,
        text: 'Aguardando informacion',
        picture: '/base.jpg',
        enabled:true
      }
    ]
  }