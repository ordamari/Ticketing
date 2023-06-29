import { TicketCreatedEvent } from '@ordamaritickets/common'
import { TicketCreatedListener } from '../ticket-created.listener'
import { natsWrapper } from '../../../nats-wrapper'
import mongoose from 'mongoose'
import { Message } from 'node-nats-streaming'
import { Ticket } from '../../../models/ticket.model'

const setup = async () => {
    const listener = new TicketCreatedListener(natsWrapper.client)
    const data: TicketCreatedEvent['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        title: 'concert',
        price: 20,
        userId: new mongoose.Types.ObjectId().toHexString(),
    }
    const msg: Partial<Message> = {
        ack: jest.fn(),
    }
    return { listener, data, msg }
}

it('create and save a ticket', async () => {
    const { listener, data, msg } = await setup()
    await listener.onMessage(data, msg as Message)
    const ticket = await Ticket.findById(data.id)
    expect(ticket).toBeDefined()
    expect(ticket!.title).toEqual(data.title)
    expect(ticket!.price).toEqual(data.price)
})

it('ack the message', async () => {
    const { listener, data, msg } = await setup()
    await listener.onMessage(data, msg as Message)
    expect(msg.ack).toHaveBeenCalled()
})
