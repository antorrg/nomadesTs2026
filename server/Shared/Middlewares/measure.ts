import type {Request, Response, NextFunction } from 'express'

export const measure = (label: string)=>{
    return (req:Request, res: Response, next: NextFunction)=>{
          console.time(label);
            res.on('finish', () => console.timeEnd(label));
            next();
    }
}