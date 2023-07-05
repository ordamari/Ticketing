import { OrderCreatedEvent, OrderStatus } from '@ordamaritickets/common'
import { natsWrapper } from '../../../nats-wrapper'
import { OrderCreatedListener } from '../order-created.listener'
import mongoose from 'mongoose'
import { Message } from 'node-nats-streaming'
import { Order } from '../../../models/order.model'

const setup = async () => {
    const listener = new OrderCreatedListener(natsWrapper.client)
    const data: OrderCreatedEvent['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        expiresAt: 'FAKE DATE',
        userId: new mongoose.Types.ObjectId().toHexString(),
        status: OrderStatus.Created,
        ticket: {
            id: new mongoose.Types.ObjectId().toHexString(),
            price: 10,
        },
    }

    const msg: Partial<Message> = {
        ack: jest.fn(),
    }

    return { listener, data, msg }
}

it('replicates the order info', async () => {
    const { listener, data, msg } = await setup()
    await listener.onMessage(data, msg as Message)
    const order = await Order.findById(data.id)
    expect(order!.price).toEqual(data.ticket.price)
})

it('ack the message', async () => {
    const { listener, data, msg } = await setup()
    await listener.onMessage(data, msg as Message)
    expect(msg.ack).toHaveBeenCalled()
})