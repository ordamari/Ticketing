import {
    Subjects,
    Publisher,
    ExpirationCompleteEvent,
} from '@ordamaritickets/common'

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
    readonly subject = Subjects.ExpirationComplete
}
