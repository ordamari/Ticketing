import express, { Request, Response } from 'express'
import { ENDPOINT } from '../constants/endpoint.constant'
import { Order, OrderStatus } from '../models/order.model'
import {
    NotAuthorizedError,
    NotFoundError,
    requireAuth,
} from '@ordamaritickets/common'
import { OrderCancelledPublisher } from '../events/publishers/order-cancelled.publisher'
import { natsWrapper } from '../nats-wrapper'
const router = express.Router()

const handler = async (req: Request, res: Response) => {
    const id = req.params.id
    const order = await Order.findById(id).populate('ticket')
    if (!order) throw new NotFoundError()
    if (order.userId !== req.currentUser!.id) throw new NotAuthorizedError()
    order.status = OrderStatus.Cancelled
    await order.save()
    new OrderCancelledPublisher(natsWrapper.client).publish({
        id: order.id,
        version: order.version,
        ticket: {
            id: order.ticket.id,
        },
    })
    res.status(204).send(order)
}

router.delete(`${ENDPOINT}/:id`, handler)

export { router as deleteOrderRouter }
