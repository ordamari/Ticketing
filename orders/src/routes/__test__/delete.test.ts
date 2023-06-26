import request from 'supertest'
import { app } from '../../app'
import { ENDPOINT } from '../../constants/endpoint.constant'
import { Ticket } from '../../models/ticket.model'
import { OrderStatus } from '@ordamaritickets/common'

const validTitle = 'validTitle'
const validPrice = 20

it('return an error if one user tries to fetch another users orders', async () => {
    const ticket = Ticket.build({
        title: validTitle,
        price: validPrice,
    })
    await ticket.save()
    const user = await global.signin()
    const anotherUser = await global.signin()

    const { body: order } = await request(app)
        .post(ENDPOINT)
        .set('Cookie', user)
        .send({
            ticketId: ticket.id,
        })
        .expect(201)

    const response = await request(app)
        .delete(`${ENDPOINT}/${order.id}`)
        .set('Cookie', anotherUser)
        .expect(401)
})

it('marks an order as cancelled', async () => {
    const ticket = Ticket.build({
        title: validTitle,
        price: validPrice,
    })
    await ticket.save()
    const user = await global.signin()

    const { body: order } = await request(app)
        .post(ENDPOINT)
        .set('Cookie', user)
        .send({
            ticketId: ticket.id,
        })
        .expect(201)

    const response = await request(app)
        .delete(`${ENDPOINT}/${order.id}`)
        .set('Cookie', user)
        .expect(204)

    const cancelledOrder = await request(app)
        .get(`${ENDPOINT}/${order.id}`)
        .set('Cookie', user)
        .expect(200)

    expect(cancelledOrder.body.status).toEqual(OrderStatus.Cancelled)
})

it.todo('emits an order cancelled event')
