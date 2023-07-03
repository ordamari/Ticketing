import { Ticket } from './ticket.type'

export type Order = {
    id: string
    userId: string
    status: string
    expiresAt: string
    ticket: Ticket
}
