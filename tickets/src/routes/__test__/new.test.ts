import request from 'supertest'
import { app } from '../../app'
import { ENDPOINT } from '../../constants/endpoint.constant'
import { Ticket } from '../../models/ticket.model'
import { natsWrapper } from '../../nats-wrapper'

const validTitle = 'Title'
const validPrice = 10

it('has a route handler listening to api/tickets for post request', async () => {
    const response = await request(app).post(ENDPOINT).send({})
    expect(response.status).not.toEqual(404)
})

it('can only be access if the user is signed in', async () => {
    const response = await request(app).post(ENDPOINT).send({})
    expect(response.status).toEqual(401)
})

it('returns a status other that 401 if the user is signed in', async () => {
    const response = await request(app)
        .post(ENDPOINT)
        .set('Cookie', await global.signin())
        .send({})
    expect(response.status).not.toEqual(401)
})

it('return an error if an invalid title is provided', async () => {
    await request(app)
        .post(ENDPOINT)
        .set('Cookie', await global.signin())
        .send({
            title: '',
            price: validPrice,
        })
        .expect(400)

    await request(app)
        .post(ENDPOINT)
        .set('Cookie', await global.signin())
        .send({
            price: validPrice,
        })
        .expect(400)
})

it('return an error if an invalid price is provided', async () => {
    await request(app)
        .post(ENDPOINT)
        .set('Cookie', await global.signin())
        .send({
            title: validTitle,
            price: 0,
        })
        .expect(400)

    await request(app)
        .post(ENDPOINT)
        .set('Cookie', await global.signin())
        .send({
            title: validTitle,
            price: -10,
        })
        .expect(400)

    await request(app)
        .post(ENDPOINT)
        .set('Cookie', await global.signin())
        .send({
            title: validTitle,
        })
        .expect(400)
})

it('create a ticket with valid parameters', async () => {
    let tickets = await Ticket.find({})
    expect(tickets.length).toEqual(0)
    await request(app)
        .post(ENDPOINT)
        .set('Cookie', await global.signin())
        .send({
            title: validTitle,
            price: validPrice,
        })
        .expect(201)
    tickets = await Ticket.find({})
    expect(tickets.length).toEqual(1)
    expect(tickets[0].title).toEqual(validTitle)
    expect(tickets[0].price).toEqual(validPrice)
})

it('publishes an event', async () => {
    await request(app)
        .post(ENDPOINT)
        .set('Cookie', await global.signin())
        .send({
            title: validTitle,
            price: validPrice,
        })
        .expect(201)
    expect(natsWrapper.client.publish).toHaveBeenCalled()
})
