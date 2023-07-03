import { useRouter } from 'next/router'
import Errors from '../../../common/components/ui/errors/Errors'
import { Endpoints } from '../../../common/enums/endpoints.enum'
import { Methods } from '../../../common/enums/methods.enum'
import { useRequest } from '../../../common/hooks/useRequest'
import useTranslation from '../../../common/hooks/useTranslation'
import { PageProps } from '../../../common/types/page-props.type'
import { Ticket } from '../../../common/types/ticket.type'
import CreateTicketForm from '../../../features/tickets/components/CreateTicketForm'

function newTicket({ currentUser }: PageProps) {
    const t = useTranslation()
    const router = useRouter()

    const [doRequest, errors] = useRequest(
        Endpoints.createTicket,
        Methods.POST,
        router.push.bind(null, '/')
    )

    return (
        <div className="">
            <CreateTicketForm
                onSubmit={doRequest}
                title={t('tickets.createTicketFormTitle')}
            />
            <Errors errors={errors} />
        </div>
    )
}
export default newTicket
