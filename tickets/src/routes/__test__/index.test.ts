import request from 'supertest'
import { app } from '../../app'
import { ENDPOINT } from '../../constants/endpoint.constant'

const validTitle = 'Title'
const validPrice = 10

const createTicket = async () => {
    return request(app)
        .post(ENDPOINT)
        .set('Cookie', await global.signin())
        .send({
            title: validTitle,
            price: validPrice,
        })
        .expect(201)
}

it('can fetch a list of tickets', async () => {
    await createTicket()
    await createTicket()
    await createTicket()
    const response = await request(app).get(ENDPOINT).send().expect(200)
    expect(response.body.length).toEqual(3)
})
