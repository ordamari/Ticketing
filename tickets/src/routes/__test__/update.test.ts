import request from 'supertest'
import { app } from '../../app'
import { ENDPOINT } from '../../constants/endpoint.constant'
import mongoose from 'mongoose'
import { natsWrapper } from '../../nats-wrapper'
import { Ticket } from '../../models/ticket.model'

const validId = new mongoose.Types.ObjectId().toHexString()
const validTitle = 'Title'
const validPrice = 10

it('returns a 404 if the provided id does not exist', async () => {
    await request(app)
        .put(`${ENDPOINT}/${validId}`)
        .set('Cookie', await global.signin())
        .send({
            title: validTitle,
            price: validPrice,
        })
        .expect(404)
})

it('returns a 401 if the user is not authenticated', async () => {
    await request(app)
        .put(`${ENDPOINT}/${validId}`)
        .send({
            title: validTitle,
            price: validPrice,
        })
        .expect(401)
})

it('returns a 401 if the user does not own the ticket', async () => {
    const response = await request(app)
        .post(ENDPOINT)
        .set('Cookie', await global.signin())
        .send({
            title: validTitle,
            price: validPrice,
        })
        .expect(201)

    await request(app)
        .put(`${ENDPOINT}/${response.body.id}`)
        .set('Cookie', await global.signin())
        .send({
            title: validTitle + 'other',
            price: validPrice,
        })
        .expect(401)
})

it('returns a 400 if the user provides an invalid title or price', async () => {
    const cookie = await global.signin()
    const response = await request(app)
        .post(ENDPOINT)
        .set('Cookie', cookie)
        .send({
            title: validTitle,
            price: validPrice,
        })
        .expect(201)

    await request(app)
        .put(`${ENDPOINT}/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: '',
            price: validPrice + 10,
        })
        .expect(400)

    await request(app)
        .put(`${ENDPOINT}/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: validTitle + 'other',
            price: -10,
        })
        .expect(400)
})

it('updates the ticket provided valid inputs', async () => {
    const newTitle = 'new title'
    const newPrice = 20

    const cookie = await global.signin()
    const response = await request(app)
        .post(ENDPOINT)
        .set('Cookie', cookie)
        .send({
            title: validTitle,
            price: validPrice,
        })
        .expect(201)

    await request(app)
        .put(`${ENDPOINT}/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: newTitle,
            price: newPrice,
        })
        .expect(200)

    const updateResponse = await request(app)
        .get(`${ENDPOINT}/${response.body.id}`)
        .send()

    expect(updateResponse.body.title).toEqual(newTitle)
    expect(updateResponse.body.price).toEqual(newPrice)
})

it('publishes an event', async () => {
    const newTitle = 'new title'
    const newPrice = 20

    const cookie = await global.signin()
    const response = await request(app)
        .post(ENDPOINT)
        .set('Cookie', cookie)
        .send({
            title: validTitle,
            price: validPrice,
        })
        .expect(201)

    await request(app)
        .put(`${ENDPOINT}/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: newTitle,
            price: newPrice,
        })
        .expect(200)

    expect(natsWrapper.client.publish).toHaveBeenCalled()
})

it('rejects updates if the ticket is reserved', async () => {
    const newTitle = 'new title'
    const newPrice = 20

    const cookie = await global.signin()
    const response = await request(app)
        .post(ENDPOINT)
        .set('Cookie', cookie)
        .send({
            title: validTitle,
            price: validPrice,
        })
        .expect(201)

    const ticket = await Ticket.findById(response.body.id)
    const orderId = new mongoose.Types.ObjectId().toHexString()
    ticket!.set({ orderId })
    await ticket!.save()

    await request(app)
        .put(`${ENDPOINT}/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: newTitle,
            price: newPrice,
        })
        .expect(400)
})
