import express, { Request, Response } from 'express'
import { ENDPOINT } from '../constants/endpoint.constant'
import { Ticket } from '../models/ticket.model'
import { body } from 'express-validator'
import { NotFoundError, BadRequestError } from '@ordamaritickets/common'
import mongoose from 'mongoose'

const router = express.Router()

const handler = async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id)
    if (!ticket) {
        throw new NotFoundError()
    }
    res.send(ticket)
}

router.get(`${ENDPOINT}/:id`, handler)

export { router as showTicketRouter }
