import {
    Publisher,
    PaymentCreatedEvent,
    Subjects,
} from '@ordamaritickets/common'

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
    readonly subject = Subjects.PaymentCreated
}
