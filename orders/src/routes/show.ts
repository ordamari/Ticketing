import express, { Request, Response } from 'express'
import { ENDPOINT } from '../constants/endpoint.constant'
import {
    NotAuthorizedError,
    NotFoundError,
    requireAuth,
} from '@ordamaritickets/common'
import { Order } from '../models/order.model'

const router = express.Router()

const handler = async (req: Request, res: Response) => {
    const id = req.params.id
    const order = await Order.findById(id).populate('ticket')
    if (!order) throw new NotFoundError()
    if (order.userId !== req.currentUser!.id) throw new NotAuthorizedError()
    res.send(order)
}

router.get(`${ENDPOINT}/:id`, requireAuth, handler)

export { router as showOrderRouter }
