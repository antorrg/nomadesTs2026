    import type { IProduct } from "../../../types/product"
    const baseImg = '/base2.jpg'
    
    export const mockProductWithItem:IProduct = {
    id: 0,
    title: 'Aguardando informacion',
    info_header: 'Aguardando informacion...',
    info_body: 'Aguardando informacion...',
    picture: `${baseImg}`,
    enabled: true,
    Items: [
      {
        id: 0,
        ProductId:0,
        text: 'Aguardando informacion',
        picture: `${baseImg}`,
        enabled:true
      }
    ]
  }