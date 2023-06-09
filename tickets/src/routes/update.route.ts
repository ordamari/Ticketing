import express, { Request, Response } from 'express'
import { ENDPOINT } from '../constants/endpoint.constant'
import { body } from 'express-validator'
import {
    BadRequestError,
    NotAuthorizedError,
    NotFoundError,
    requireAuth,
    validateRequest,
} from '@ordamaritickets/common'
import { Ticket } from '../models/ticket.model'
import { TicketUpdatedPublisher } from '../events/publishers/ticket-updated.publisher'
import { natsWrapper } from '../nats-wrapper'

const router = express.Router()

const validation = [
    body('title').not().isEmpty().withMessage('Title is required'),
    body('price')
        .isFloat({ gt: 0 })
        .withMessage('Price must be greater than 0'),
]

const handler = async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id)

    if (!ticket) throw new NotFoundError()
    if (ticket.orderId)
        throw new BadRequestError('Cannot edit a reserved ticket')
    if (ticket.userId !== req.currentUser!.id) throw new NotAuthorizedError()

    const { title, price } = req.body
    ticket.set({
        title,
        price,
    })
    await ticket.save()
    new TicketUpdatedPublisher(natsWrapper.client).publish({
        id: ticket.id,
        title: ticket.title,
        price: ticket.price,
        userId: ticket.userId,
        version: ticket.version,
    })
    res.send(ticket)
}

router.put(`${ENDPOINT}/:id`, requireAuth, validation, validateRequest, handler)

export { router as updateTicketRouter }
