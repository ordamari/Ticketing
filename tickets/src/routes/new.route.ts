import express, { Request, Response } from 'express'
import { ENDPOINT } from '../constants/endpoint.constant'
import { body } from 'express-validator'
import { requireAuth, validateRequest } from '@ordamaritickets/common'
import { Ticket } from '../models/ticket.model'
import { TicketCreatedPublisher } from '../events/publishers/ticket-created.publisher'
import { natsWrapper } from '../nats-wrapper'

const router = express.Router()

const validation = [
    body('title').not().isEmpty().withMessage('Title is required'),
    body('price')
        .isFloat({ gt: 0 })
        .withMessage('Price must be greater than 0'),
]

const handler = async (req: Request, res: Response) => {
    const { title, price } = req.body
    const ticket = Ticket.build({
        title,
        price,
        userId: req.currentUser!.id,
    })
    await ticket.save()
    await new TicketCreatedPublisher(natsWrapper.client).publish({
        id: ticket.id,
        title: ticket.title,
        price: ticket.price,
        userId: ticket.userId,
    })
    res.status(201).send(ticket)
}

router.post(ENDPOINT, requireAuth, validation, validateRequest, handler)

export { router as createTicketRouter }
