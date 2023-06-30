import { ExpirationCompleteEvent, OrderStatus } from '@ordamaritickets/common'
import { Message } from 'node-nats-streaming'
import { Order } from '../../../models/order.model'
import { Ticket } from '../../../models/ticket.model'
import { natsWrapper } from '../../../nats-wrapper'
import { ExpirationCompleteListener } from '../expiration-complete.listener'
import mongoose from 'mongoose'

const setup = async () => {
    const listener = new ExpirationCompleteListener(natsWrapper.client)
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 20,
    })
    await ticket.save()

    const order = Order.build({
        status: OrderStatus.Created,
        userId: new mongoose.Types.ObjectId().toHexString(),
        expiresAt: new Date(),
        ticket,
    })
    await order.save()

    const data: ExpirationCompleteEvent['data'] = {
        orderId: order.id,
    }

    const msg: Partial<Message> = {
        ack: jest.fn(),
    }

    return { listener, order, ticket, data, msg }
}

it('updates the order status to cancelled', async () => {
    const { listener, order, data, msg } = await setup()
    await listener.onMessage(data, msg as Message)
    const updatedOrder = await Order.findById(order.id)
    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled)
})

it('emit an OrderCancelled event', async () => {
    const { listener, order, data, msg } = await setup()
    await listener.onMessage(data, msg as Message)
    expect(natsWrapper.client.publish).toHaveBeenCalled()
    const eventData = JSON.parse(
        (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
    )
    expect(eventData.id).toEqual(order.id)
})

it('ack the message', async () => {
    const { listener, data, msg } = await setup()
    await listener.onMessage(data, msg as Message)
    expect(msg.ack).toHaveBeenCalled()
})
