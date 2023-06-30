import {
    Listener,
    OrderStatus,
    PaymentCreatedEvent,
    Subjects,
} from '@ordamaritickets/common'
import { Message } from 'node-nats-streaming'
import { QUEUE_GROUP_NAME } from '../../constants/queue-group-name.constant'
import { Order } from '../../models/order.model'

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
    readonly subject = Subjects.PaymentCreated
    queueGroupName = QUEUE_GROUP_NAME

    async onMessage(data: PaymentCreatedEvent['data'], msg: Message) {
        const { id, orderId, stripeId } = data
        const order = await Order.findById(orderId)
        if (!order) throw new Error('Order not found')
        order.set({ status: OrderStatus.Complete })
        await order.save()
        msg.ack()
    }
}
