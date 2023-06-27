import request from 'supertest'
import { app } from '../../app'
import { ENDPOINT } from '../../constants/endpoint.constant'
import { Ticket } from '../../models/ticket.model'
import mongoose from 'mongoose'

const validTitle = 'validTitle'
const validPrice = 20
const validId = new mongoose.Types.ObjectId().toHexString()

it('return an error if one user tries to fetch another users orders', async () => {
    const ticket = Ticket.build({
        title: validTitle,
        price: validPrice,
        id: validId,
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
        .get(`${ENDPOINT}/${order.id}`)
        .set('Cookie', anotherUser)
        .expect(401)
})

it('fetches the order', async () => {
    const ticket = Ticket.build({
        title: validTitle,
        price: validPrice,
        id: validId,
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
        .get(`${ENDPOINT}/${order.id}`)
        .set('Cookie', user)
        .expect(200)
    expect(response.body.id).toEqual(order.id)
})
