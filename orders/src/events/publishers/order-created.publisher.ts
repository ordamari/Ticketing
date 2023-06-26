import { Publisher, OrderCreatedEvent, Subjects } from '@ordamaritickets/common'

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    readonly subject = Subjects.OrderCreated
}
