import express, { Request, Response } from 'express'
import { ENDPOINT } from '../constants/endpoint.constant'
import { requireAuth } from '@ordamaritickets/common'
import { Order } from '../models/order.model'
const router = express.Router()

const handler = async (req: Request, res: Response) => {
    const orders = await Order.find({
        userId: req.currentUser!.id,
    }).populate('ticket')
    res.send(orders)
}

router.get(ENDPOINT, requireAuth, handler)

export { router as indexOrderRouter }
