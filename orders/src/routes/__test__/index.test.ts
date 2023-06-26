import request from 'supertest'
import { app } from '../../app'
import { ENDPOINT } from '../../constants/endpoint.constant'
import { Ticket } from '../../models/ticket.model'

const createTicket = async () => {
    const ticket = Ticket.build({
        title: 'validTitle',
        price: 20,
    })
    await ticket.save()
    return ticket
}

it('fetches orders for a particular user', async () => {
    const ticket1 = await createTicket()
    const ticket2 = await createTicket()
    const ticket3 = await createTicket()

    const user1 = await global.signin()
    const user2 = await global.signin()

    await request(app)
        .post(ENDPOINT)
        .set('Cookie', user1)
        .send({
            ticketId: ticket1.id,
        })
        .expect(201)

    const { body: order1 } = await request(app)
        .post(ENDPOINT)
        .set('Cookie', user2)
        .send({
            ticketId: ticket2.id,
        })
        .expect(201)

    const { body: order2 } = await request(app)
        .post(ENDPOINT)
        .set('Cookie', user2)
        .send({
            ticketId: ticket3.id,
        })

    const response = await request(app)
        .get(ENDPOINT)
        .set('Cookie', user2)
        .expect(200)

    expect(response.body.length).toEqual(2)
    expect(response.body[0].id).toEqual(order1.id)
    expect(response.body[1].id).toEqual(order2.id)
    expect(response.body[0].ticket.id).toEqual(ticket2.id)
    expect(response.body[1].ticket.id).toEqual(ticket3.id)
})
