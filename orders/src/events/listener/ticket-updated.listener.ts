import { Message } from 'node-nats-streaming'
import { TicketUpdatedEvent, Listener, Subjects } from '@ordamaritickets/common'
import { Ticket } from '../../models/ticket.model'
import { QUEUE_GROUP_NAME } from '../../constants/queue-group-name.constant'

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
    readonly subject = Subjects.TicketUpdated
    queueGroupName = QUEUE_GROUP_NAME

    async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
        const { title, price, id } = data
        const ticket = await Ticket.findById(id)
        if (!ticket) throw new Error('Ticket not found')
        ticket.set({ title, price })
        await ticket.save()
        msg.ack()
    }
}
