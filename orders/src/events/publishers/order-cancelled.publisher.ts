import {
    Publisher,
    OrderCancelledEvent,
    Subjects,
} from '@ordamaritickets/common'

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    readonly subject = Subjects.OrderCancelled
}
