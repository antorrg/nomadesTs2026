import express, {type Request, type Response, type NextFunction} from 'express'
import { UserMidd } from '../UserMidd.ts'


const mockSession = (req: Request, _res: Response, next: NextFunction) => {
  req.session = {
    user: { id: '123', email: 'emailexample@fake.com', role: 'USER' }
  } as any
  next()
}
const testServer = express()
testServer.use(express.json())

testServer.post('/test/create', UserMidd.createUser, (req:Request, res:Response)=>{
    const data = req.body
    res.status(200).json({message:'Passed middleware', data})
})
testServer.put('/test/profile/:id', mockSession, UserMidd.profileGuard, (req:Request, res:Response)=>{
    const {id} = req.params
    const data = req.body
    res.status(200).json({message:'Passed middleware', id, data})
})
testServer.put('/test/nosession/:id', UserMidd.profileGuard, (req:Request, res:Response)=>{
    const {id} = req.params
    const data = req.body
    res.status(200).json({message:'Passed middleware', id, data})
})

testServer.post('/test/resetPassword', UserMidd.resetPassword, (req:Request, res:Response)=>{
    const data = req.body
    res.status(200).json({message:'Passed middleware', data})
})

//! Error handler
testServer.use((err: any, req: Request, res: Response, next: NextFunction)=>{
  const status = err.status || 500
  const message = err.message || 'Internal server error'

  res.status(status).json({
    success: false,
    message,
    results: null // Alineado con la estructura de BaseController
  })
})

export default testServer