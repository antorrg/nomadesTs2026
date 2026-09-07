import { Request, Response, NextFunction } from 'express'
import { domainToUnicode } from 'node:url'

export const domainRedirect = (canonicalHost: string, alternateHost:string) => {
    return (req: Request, res:Response, next:NextFunction)=>{
        const hostname = domainToUnicode(req.hostname)
        if(
            hostname === alternateHost ||
            hostname === `www.${alternateHost}`||
            hostname === `www.${canonicalHost}`
        ){
            return res.redirect(
                301,
                `https://${canonicalHost}${req.originalUrl}`
            )
        }
        next()
    }
}
