import {
    Listener,
    OrderCancelledEvent,
    Subjects,
} from '@ordamaritickets/common'
import { Message } from 'node-nats-streaming'
import { QUEUE_GROUP_NAME } from '../../constants/queue-group-name.constant'
import { Ticket } from '../../models/ticket.model'
import { TicketUpdatedPublisher } from '../publishers/ticket-updated.publisher'

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
    readonly subject = Subjects.OrderCancelled
    queueGroupName = QUEUE_GROUP_NAME

    async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
        const { ticket } = data
        const updatedTicket = await Ticket.findById(ticket.id)
        if (!updatedTicket) throw new Error('Ticket not found')
        updatedTicket.set({ orderId: undefined })
        await updatedTicket.save()
        await new TicketUpdatedPublisher(this.client).publish({
            id: updatedTicket.id,
            price: updatedTicket.price,
            title: updatedTicket.title,
            userId: updatedTicket.userId,
            orderId: updatedTicket.orderId,
            version: updatedTicket.version,
        })
        msg.ack()
    }
}
