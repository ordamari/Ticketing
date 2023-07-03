import { User } from '../common/types/user.type'
import useTranslation from '../common/hooks/useTranslation'
import { PageProps } from '../common/types/page-props.type'
import { Ticket } from '../common/types/ticket.type'
import TicketList from '../features/tickets/components/TicketList'

type PrivateProps = {
    tickets: Ticket[]
} & PageProps

function Home({ currentUser, tickets }: PrivateProps) {
    const t = useTranslation()

    if (!currentUser) return <h1>{t('global.notSignedIn')}</h1>
    return (
        <div>
            <h1>{t('tickets.title')}</h1>
            <TicketList tickets={tickets} />
        </div>
    )
}

Home.getInitialProps = async (context, client, currentUser) => {
    const { data } = await client.get('/api/tickets')
    return { tickets: data }
}

export default Home
