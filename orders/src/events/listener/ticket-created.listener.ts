import { Message } from 'node-nats-streaming'
import { TicketCreatedEvent, Listener, Subjects } from '@ordamaritickets/common'
import { Ticket } from '../../models/ticket.model'
import { QUEUE_GROUP_NAME } from '../../constants/queue-group-name.constant'

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
    readonly subject = Subjects.TicketCreated
    queueGroupName = QUEUE_GROUP_NAME

    async onMessage(data: TicketCreatedEvent['data'], msg: Message) {
        const { title, price, id } = data
        const ticket = Ticket.build({
            id,
            title,
            price,
        })
        await ticket.save()
        msg.ack()
    }
}
