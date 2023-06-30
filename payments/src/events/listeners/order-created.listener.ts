import { Listener, OrderCreatedEvent, Subjects } from '@ordamaritickets/common'
import { QUEUE_GROUP_NAME } from '../../constants/queue-group-name.constant'
import { Message } from 'node-nats-streaming'
import { Order } from '../../models/order.model'

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    readonly subject = Subjects.OrderCreated
    queueGroupName = QUEUE_GROUP_NAME

    async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
        const {
            id,
            status,
            userId,
            version,
            ticket: { price },
        } = data
        const order = Order.build({
            id,
            status,
            userId,
            version,
            price,
        })
        await order.save()
        msg.ack()
    }
}
