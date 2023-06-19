import express, { Request, Response } from 'express'
import { ENDPOINT } from '../constants/endpoint.constant'
import { Ticket } from '../models/ticket.model'

const router = express.Router()

const handler = async (req: Request, res: Response) => {
    const tickets = await Ticket.find({})
    res.send(tickets)
}

router.get(ENDPOINT, handler)

export { router as indexTicketRouter }
