import express, { Request, Response } from 'express'
import { ENDPOINT } from '../constants/endpoint.constant'
import { body } from 'express-validator'
import {
    NotAuthorizedError,
    NotFoundError,
    requireAuth,
    validateRequest,
} from '@ordamaritickets/common'
import { Ticket } from '../models/ticket.model'

const router = express.Router()

const validation = [
    body('title').not().isEmpty().withMessage('Title is required'),
    body('price')
        .isFloat({ gt: 0 })
        .withMessage('Price must be greater than 0'),
]

const handler = async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id)
    if (!ticket) {
        throw new NotFoundError()
    }
    if (ticket.userId !== req.currentUser!.id) {
        throw new NotAuthorizedError()
    }
    const { title, price } = req.body
    ticket.set({
        title,
        price,
    })
    await ticket.save()
    res.send(ticket)
}

router.put(`${ENDPOINT}/:id`, requireAuth, validation, validateRequest, handler)

export { router as updateTicketRouter }
