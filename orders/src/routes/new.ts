import express, { Request, Response } from 'express'
import { ENDPOINT } from '../../constants/endpoint.constant'
import {
    requireAuth,
    validateRequest,
    NotFoundError,
    BadRequestError,
} from '@ordamaritickets/common'
import mongoose from 'mongoose'
import { body } from 'express-validator'
import { Ticket } from '../models/ticket.model'
import { Order } from '../models/order.model'

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
}

router.post(ENDPOINT, requireAuth, validateRequest, validators, handler)

export { router as newOrderRouter }
