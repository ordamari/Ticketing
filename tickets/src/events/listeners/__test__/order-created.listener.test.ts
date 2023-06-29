import { OrderCreatedEvent, OrderStatus } from '@ordamaritickets/common'
import { OrderCreatedListener } from '../order-created.listener'
import { natsWrapper } from '../../../nats-wrapper'
import { Ticket } from '../../../models/ticket.model'
import mongoose from 'mongoose'
import { Message } from 'node-nats-streaming'

const setup = async () => {
    const listener = new OrderCreatedListener(natsWrapper.client)
    const ticket = Ticket.build({
        title: 'concert',
        price: 20,
        userId: new mongoose.Types.ObjectId().toHexString(),
    })
    await ticket.save()
    const data: OrderCreatedEvent['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        status: OrderStatus.Created,
        userId: new mongoose.Types.ObjectId().toHexString(),
        expiresAt: 'fake date',
        ticket: {
            id: ticket.id,
            price: ticket.price,
        },
    }

    const msg: Partial<Message> = {
        ack: jest.fn(),
    }

    return { listener, data, msg, ticket }
}

it('sets the orderId of the ticket', async () => {
    const { listener, data, msg, ticket } = await setup()
    await listener.onMessage(data, msg as Message)
    const updatedTicket = await Ticket.findById(ticket.id)
    expect(updatedTicket!.orderId).toEqual(data.id)
})

it('ack the message', async () => {
    const { listener, data, msg } = await setup()
    await listener.onMessage(data, msg as Message)
    expect(msg.ack).toHaveBeenCalled()
})

it('publishes a ticket updated event', async () => {
    const { listener, data, msg } = await setup()
    await listener.onMessage(data, msg as Message)
    expect(natsWrapper.client.publish).toHaveBeenCalled()
    const ticketUpdatedData = JSON.parse(
        (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
    )
    expect(data.id).toEqual(ticketUpdatedData.orderId)
})
