import { QUEUE_GROUP_NAME } from '../../constants/queue-group-name.constant'
import { Message } from 'node-nats-streaming'
import { Order } from '../../models/order.model'
import {
    Listener,
    Subjects,
    OrderCancelledEvent,
    OrderStatus,
} from '@ordamaritickets/common'

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
    readonly subject = Subjects.OrderCancelled
    queueGroupName = QUEUE_GROUP_NAME

    async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
        const order = await Order.findByEvent(data)
        if (!order) throw new Error('Order not found')
        order.set({ status: OrderStatus.Cancelled })
        await order.save()
        msg.ack()
    }
}
