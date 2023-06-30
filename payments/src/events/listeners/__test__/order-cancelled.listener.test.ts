import { OrderCancelledListener } from '../order-cancelled.listener'
import { natsWrapper } from '../../../nats-wrapper'
import { OrderCancelledEvent, OrderStatus } from '@ordamaritickets/common'
import mongoose from 'mongoose'
import { Order } from '../../../models/order.model'
import { Message } from 'node-nats-streaming'

const setup = async () => {
    const listener = new OrderCancelledListener(natsWrapper.client)
    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        status: OrderStatus.Created,
        price: 10,
        userId: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
    })
    await order.save()
    const data: OrderCancelledEvent['data'] = {
        id: order.id,
        version: 1,
        ticket: {
            id: new mongoose.Types.ObjectId().toHexString(),
        },
    }

    const msg: Partial<Message> = {
        ack: jest.fn(),
    }

    return { listener, data, msg, order }
}

it('updates the status of the order', async () => {
    const { listener, data, msg, order } = await setup()
    await listener.onMessage(data, msg as Message)
    const updatedOrder = await Order.findById(order.id)
    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled)
})

it('ack the message', async () => {
    const { listener, data, msg } = await setup()
    await listener.onMessage(data, msg as Message)
    expect(msg.ack).toHaveBeenCalled()
})
