import { TicketUpdatedEvent } from '@ordamaritickets/common'
import { TicketUpdatedListener } from '../ticket-updated.listener'
import { natsWrapper } from '../../../nats-wrapper'
import mongoose from 'mongoose'
import { Message } from 'node-nats-streaming'
import { Ticket } from '../../../models/ticket.model'

const setup = async () => {
    const listener = new TicketUpdatedListener(natsWrapper.client)
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 20,
    })
    await ticket.save()
    const data: TicketUpdatedEvent['data'] = {
        id: ticket.id,
        version: ticket.version + 1,
        title: 'new concert',
        price: 999,
        userId: new mongoose.Types.ObjectId().toHexString(),
    }

    const msg: Partial<Message> = {
        ack: jest.fn(),
    }
    return { listener, data, msg, ticket }
}

it('finds, updates, and saves a ticket', async () => {
    const { listener, data, msg, ticket } = await setup()
    await listener.onMessage(data, msg as Message)
    const updatedTicket = await Ticket.findById(ticket.id)
    expect(updatedTicket!.title).toEqual(data.title)
    expect(updatedTicket!.price).toEqual(data.price)
    expect(updatedTicket!.version).toEqual(data.version)
})

it('ack the message', async () => {
    const { listener, data, msg } = await setup()
    await listener.onMessage(data, msg as Message)
    expect(msg.ack).toHaveBeenCalled()
})

it('does not call ack if the event has a skipped version number', async () => {
    const { listener, data, msg } = await setup()
    data.version = 10
    try {
        await listener.onMessage(data, msg as Message)
    } catch (error) {}
    expect(msg.ack).not.toHaveBeenCalled()
})
