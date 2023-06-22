import {
    Publisher,
    Subjects,
    TicketCreatedEvent,
} from '@ordamaritickets/common'

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    readonly subject = Subjects.TicketCreated
}
