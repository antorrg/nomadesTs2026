import type {Request, Response, NextFunction } from 'express'

export const finder = (label: string)=>{
    return (req:Request, res: Response, next: NextFunction)=>{
            console.log(`=== ${label} ===`)
            console.log('METHOD:', req.method)
            console.log('URL:', req.originalUrl)
            console.log('CONTENT-TYPE:', req.headers['content-type'])
            console.log('ORIGIN:', req.headers.origin)
            console.log('BODY:', req.body)
            console.log('COOKIES:', req.cookies)
            next();
    }
}