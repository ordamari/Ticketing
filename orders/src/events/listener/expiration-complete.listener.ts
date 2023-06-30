import {
    ExpirationCompleteEvent,
    Listener,
    OrderStatus,
    Subjects,
} from '@ordamaritickets/common'
import { QUEUE_GROUP_NAME } from '../../constants/queue-group-name.constant'
import { Message } from 'node-nats-streaming'
import { Order } from '../../models/order.model'
import { OrderCancelledPublisher } from '../publishers/order-cancelled.publisher'

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
    readonly subject = Subjects.ExpirationComplete
    queueGroupName = QUEUE_GROUP_NAME

    async onMessage(data: ExpirationCompleteEvent['data'], msg: Message) {
        const { orderId } = data
        const order = await Order.findById(orderId).populate('ticket')
        if (!order) throw new Error('Order not found')
        if (order.status === OrderStatus.Complete) return msg.ack()
        order.set({ status: OrderStatus.Cancelled })
        await order.save()
        new OrderCancelledPublisher(this.client).publish({
            id: order.id,
            version: order.version,
            ticket: {
                id: order.ticket.id,
            },
        })
        msg.ack()
    }
}
