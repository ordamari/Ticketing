import { Ticket } from '../../../common/types/ticket.type'
import TicketPreview from './TicketPreview'

type PrivateProps = {
    tickets: Ticket[]
}

function TicketList({ tickets }: PrivateProps) {
    return (
        <div className="ticket-list">
            {tickets.map((ticket) => (
                <TicketPreview key={ticket.id} ticket={ticket} />
            ))}
        </div>
    )
}

export default TicketList
