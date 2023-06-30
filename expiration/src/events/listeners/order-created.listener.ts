import { Listener, OrderCreatedEvent, Subjects } from '@ordamaritickets/common'
import { QUEUE_GROUP_NAME } from '../../constants/queue-group-name.constant'
import { Message } from 'node-nats-streaming'
import { expirationQueue } from '../../queues/expiration.queue'
export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    readonly subject = Subjects.OrderCreated
    queueGroupName = QUEUE_GROUP_NAME

    async onMessage(
        data: OrderCreatedEvent['data'],
        msg: Message
    ): Promise<void> {
        const delay = new Date(data.expiresAt).getTime() - new Date().getTime()
        expirationQueue.add(
            {
                orderId: data.id,
            },
            {
                delay,
            }
        )
        msg.ack()
    }
}
