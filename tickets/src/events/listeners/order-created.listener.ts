import { Listener, OrderCreatedEvent, Subjects } from '@ordamaritickets/common'
import { Message } from 'node-nats-streaming'
import { QUEUE_GROUP_NAME } from '../../constants/queue-group-name.constant'
import { Ticket } from '../../models/ticket.model'
import { TicketUpdatedPublisher } from '../publishers/ticket-updated.publisher'

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    readonly subject = Subjects.OrderCreated
    queueGroupName = QUEUE_GROUP_NAME

    async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
        const { id, ticket: orderTicket, status, userId, version } = data
        const ticket = await Ticket.findById(orderTicket.id)
        if (!ticket) throw new Error('Ticket not found')
        ticket.set({ orderId: id })
        await ticket.save()
        await new TicketUpdatedPublisher(this.client).publish({
            id: ticket.id,
            price: ticket.price,
            title: ticket.title,
            userId: ticket.userId,
            orderId: ticket.orderId,
            version: ticket.version,
        })
        msg.ack()
    }
}
