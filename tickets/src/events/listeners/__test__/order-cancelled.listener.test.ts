import mongoose from 'mongoose'
import { natsWrapper } from '../../../nats-wrapper'
import { OrderCancelledListener } from '../order-cancelled.listener'
import { Ticket } from '../../../models/ticket.model'
import { OrderCancelledEvent } from '@ordamaritickets/common'
import { Message } from 'node-nats-streaming'

const setup = async () => {
    const listener = new OrderCancelledListener(natsWrapper.client)
    const orderId = new mongoose.Types.ObjectId().toHexString()
    const ticket = Ticket.build({
        title: 'concert',
        price: 20,
        userId: new mongoose.Types.ObjectId().toHexString(),
    })
    ticket.set({ orderId })
    await ticket.save()
    const data: OrderCancelledEvent['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        ticket: {
            id: ticket.id,
        },
    }
    const msg: Partial<Message> = {
        ack: jest.fn(),
    }
    return { listener, data, msg, ticket, orderId }
}

it('updates the ticket, publishes an event, and ack the message', async () => {
    const { listener, data, msg, ticket, orderId } = await setup()
    await listener.onMessage(data, msg as Message)
    const updatedTicket = await Ticket.findById(ticket.id)
    expect(updatedTicket!.orderId).not.toBeDefined()
    expect(msg.ack).toHaveBeenCalled()
    expect(natsWrapper.client.publish).toHaveBeenCalled()
    const ticketUpdatedData = JSON.parse(
        (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
    )
    expect(ticketUpdatedData.orderId).not.toBeDefined()
})
