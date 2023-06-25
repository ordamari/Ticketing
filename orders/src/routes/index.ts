import express, { Request, Response } from 'express'
import { ENDPOINT } from '../../constants/endpoint.constant'

const router = express.Router()

const handler = (req: Request, res: Response) => {
    res.send({})
}

router.get(ENDPOINT, handler)

export { router as indexOrderRouter }
