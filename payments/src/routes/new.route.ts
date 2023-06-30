import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import {
    requireAuth,
    validateRequest,
    BadRequestError,
    NotFoundError,
    NotAuthorizedError,
    OrderStatus,
} from '@ordamaritickets/common'
import { ENDPOINT } from '../constants/endpoint.constant'
import { Order } from '../models/order.model'
import { stripe } from '../stripe'
import { Payment } from '../models/payment.model'
import { PaymentCreatedPublisher } from '../events/publishers/payment-created.publisher'
import { natsWrapper } from '../nats-wrapper'

const router = express.Router()

const validation = [
    body('token').not().isEmpty().withMessage('Token is required'),
    body('orderId').not().isEmpty().withMessage('Order ID is required'),
]

const handler = async (req: Request, res: Response) => {
    const { token, orderId } = req.body
    const order = await Order.findById(orderId)
    if (!order) throw new NotFoundError()
    if (order.userId !== req.currentUser!.id) throw new NotAuthorizedError()
    if (order.status === OrderStatus.Cancelled)
        throw new BadRequestError('Order is cancelled')

    const charge = await stripe.charges.create({
        currency: 'usd',
        amount: order.price * 100,
        source: token,
    })

    const payment = Payment.build({
        orderId: order.id,
        stripeId: charge.id,
    })
    await payment.save()
    await new PaymentCreatedPublisher(natsWrapper.client).publish({
        id: payment.id,
        orderId: payment.orderId,
        stripeId: payment.stripeId,
    })
    res.status(201).send({
        id: payment.id,
    })
}

router.post(ENDPOINT, requireAuth, validation, validateRequest, handler)

export { router as createChargeRouter }
