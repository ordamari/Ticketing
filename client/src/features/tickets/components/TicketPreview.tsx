import { useRouter } from 'next/router'
import { Ticket } from '../../../common/types/ticket.type'
import Link from 'next/link'
import useTranslation from '../../../common/hooks/useTranslation'
import Button from '../../../common/components/ui/button/Button'

type PrivateProps = {
    ticket: Ticket
}
function TicketPreview({ ticket }: PrivateProps) {
    const t = useTranslation()
    return (
        <div className="ticket-preview ">
            <h3>{ticket.title}</h3>
            <h5>{ticket.price}</h5>
            <Button href={`/tickets/${ticket.id}`}>
                {t('tickets.viewTicket')}
            </Button>
        </div>
    )
}

export default TicketPreview
