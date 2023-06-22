import {
    Publisher,
    Subjects,
    TicketUpdatedEvent,
} from '@ordamaritickets/common'

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    readonly subject = Subjects.TicketUpdated
}
