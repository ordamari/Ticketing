import { OrderStatus } from '@ordamaritickets/common'
import mongoose from 'mongoose'
import { updateIfCurrentPlugin } from 'mongoose-update-if-current'

export { OrderStatus }

interface OrderAttrs {
    userId: string
    status: OrderStatus
    version: number
    price: number
    id: string
}

interface OrderDoc extends mongoose.Document {
    userId: string
    status: OrderStatus
    version: number
    price: number
}

interface OrderModel extends mongoose.Model<OrderDoc> {
    build(attrs: OrderAttrs): OrderDoc
    findByEvent(event: {
        id: string
        version: number
    }): Promise<OrderDoc | null>
}

const orderSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            required: true,
            enum: Object.values(OrderStatus),
            default: OrderStatus.Created,
        },
        price: {
            type: Number,
            required: true,
        },
    },
    {
        toJSON: {
            transform(doc, ret) {
                ret.id = ret._id
                delete ret._id
            },
        },
    }
)

orderSchema.set('versionKey', 'version')
orderSchema.plugin(updateIfCurrentPlugin)

orderSchema.statics.build = (attrs: OrderAttrs) => {
    return new Order({
        _id: attrs.id,
        userId: attrs.userId,
        status: attrs.status,
        version: attrs.version,
        price: attrs.price,
    })
}

orderSchema.statics.findByEvent = (event: { id: string; version: number }) => {
    const { id, version } = event
    return Order.findOne({
        _id: id,
        version: version - 1,
    })
}

const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema)

export { Order }
