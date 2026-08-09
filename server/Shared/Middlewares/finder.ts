import type {Request, Response, NextFunction } from 'express'

export const finder = (label: string)=>{
    return (req:Request, res: Response, next: NextFunction)=>{
          console.log(`Request capturada en ${label} (req.body): `,req.body)
            next();
    }
}