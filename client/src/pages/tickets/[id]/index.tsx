import { useRouter } from 'next/router'
import Button from '../../../common/components/ui/button/Button'
import Errors from '../../../common/components/ui/errors/Errors'
import { Endpoints } from '../../../common/enums/endpoints.enum'
import { Methods } from '../../../common/enums/methods.enum'
import { useRequest } from '../../../common/hooks/useRequest'
import useTranslation from '../../../common/hooks/useTranslation'
import { PageProps } from '../../../common/types/page-props.type'
import { Ticket } from '../../../common/types/ticket.type'
import { Order } from '../../../common/types/order.type'

type PrivateProps = {
    ticket: Ticket
} & PageProps

function TicketDetails({ currentUser, ticket }: PrivateProps) {
    const t = useTranslation()
    const router = useRouter()

    const onStartOrder = (order: Order) => {
        router.push(`/orders/${order.id}`)
    }

    const [doRequest, errors] = useRequest(
        Endpoints.createOrder,
        Methods.POST,
        onStartOrder
    )

    return (
        <div className="flex column gap-medium">
            <h1>{ticket.title}</h1>
            <p>
                {t('tickets.price')}: {ticket.price}
            </p>
            <Errors errors={errors} />

            <Button onClick={doRequest.bind(null, { ticketId: ticket.id })}>
                {t('tickets.purchase')}
            </Button>
        </div>
    )
}

TicketDetails.getInitialProps = async (context, client, currentUser) => {
    const { id } = context.query
    const { data } = await client.get(`/api/tickets/${id}`)
    return { ticket: data }
}

export default TicketDetails
