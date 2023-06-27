import request from 'supertest'
import { app } from '../../app'
import { ENDPOINT } from '../../constants/endpoint.constant'
import mongoose from 'mongoose'
import { Ticket } from '../../models/ticket.model'
import { Order, OrderStatus } from '../../models/order.model'
import { natsWrapper } from '../../nats-wrapper'

const validId = new mongoose.Types.ObjectId().toHexString()

const createTicket = async () => {
    const ticket = Ticket.build({
        title: 'validTitle',
        price: 20,
        id: validId,
    })
    await ticket.save()
    return ticket
}

it('returns an error if the ticket does not exist', async () => {
    await request(app)
        .post(ENDPOINT)
        .set('Cookie', await global.signin())
        .send({
            ticketId: validId,
        })
        .expect(404)
})

it('returns an error if the ticket is already reserved', async () => {
    const ticket = await createTicket()
    const order = Order.build({
        ticket,
        userId: validId,
        status: OrderStatus.Created,
        expiresAt: new Date(),
    })
    await order.save()
    await request(app)
        .post(ENDPOINT)
        .set('Cookie', await global.signin())
        .send({
            ticketId: ticket.id,
        })
        .expect(400)
})

it('reserves a ticket', async () => {
    const ticket = await createTicket()
    await request(app)
        .post(ENDPOINT)
        .set('Cookie', await global.signin())
        .send({
            ticketId: ticket.id,
        })
        .expect(201)
})

it('emits an order created event', async () => {
    const ticket = await createTicket()
    await request(app)
        .post(ENDPOINT)
        .set('Cookie', await global.signin())
        .send({
            ticketId: ticket.id,
        })
        .expect(201)

    expect(natsWrapper.client.publish).toHaveBeenCalled()
})
