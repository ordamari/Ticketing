import request from 'supertest'
import { app } from '../../app'
import { ENDPOINT } from '../../constants/endpoint.constant'
import mongoose from 'mongoose'

const validTitle = 'Title'
const validPrice = 10

const validId = new mongoose.Types.ObjectId().toHexString()

it('returns a 404 if the ticket is not found', async () => {
    await request(app).get(`${ENDPOINT}/${validId}`).send().expect(404)
})

it('returns the ticket if the ticket is found', async () => {
    const response = await request(app)
        .post(ENDPOINT)
        .set('Cookie', await global.signin())
        .send({
            title: validTitle,
            price: validPrice,
        })
        .expect(201)

    const ticketResponse = await request(app)
        .get(`${ENDPOINT}/${response.body.id}`)
        .expect(200)

    expect(ticketResponse.body.title).toEqual(validTitle)
    expect(ticketResponse.body.price).toEqual(validPrice)
})
