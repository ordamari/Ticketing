import express, { Request, Response } from 'express'
import { ENDPOINT } from '../constants/endpoint.constant'
import {
    requireAuth,
    validateRequest,
    NotFoundError,
    BadRequestError,
} from '@ordamaritickets/common'
import mongoose from 'mongoose'
import { body } from 'express-validator'
import { Ticket } from '../models/ticket.model'
import { Order, OrderStatus } from '../models/order.model'
import { EXPIRATION_WINDOW_SECONDS } from '../constants/expiration-window-seconds.constant'
import { natsWrapper } from '../nats-wrapper'
import { OrderCreatedPublisher } from '../events/publishers/order-created.publisher'

const router = express.Router()

const validators = [
    body('ticketId')
        .not()
        .isEmpty()
        .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
        .withMessage('TicketId must be provided'),
]

const handler = async (req: Request, res: Response) => {
    const { ticketId } = req.body
    const ticket = await Ticket.findById(ticketId)
    if (!ticket) throw new NotFoundError()
    const isReserved = await ticket.isReserved()
    if (isReserved) throw new BadRequestError('Ticket is already reserved')
    const expiration = new Date()
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS)
    const order = Order.build({
        userId: req.currentUser!.id,
        status: OrderStatus.Created,
        expiresAt: expiration,
        ticket,
    })
    new OrderCreatedPublisher(natsWrapper.client).publish({
        id: order.id,
        status: order.status,
        userId: order.userId,
        expiresAt: order.expiresAt.toISOString(),
        ticket: {
            id: ticket.id,
            price: ticket.price,
        },
    })
    await order.save()
    res.status(201).send(order)
}

router.post(ENDPOINT, requireAuth, validateRequest, validators, handler)

export { router as newOrderRouter }
