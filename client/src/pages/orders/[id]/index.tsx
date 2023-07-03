import { useRouter } from 'next/router'
import Errors from '../../../common/components/ui/errors/Errors'
import { Endpoints } from '../../../common/enums/endpoints.enum'
import { Methods } from '../../../common/enums/methods.enum'
import { useRequest } from '../../../common/hooks/useRequest'
import { Order as TOrder } from '../../../common/types/order.type'
import { PageProps } from '../../../common/types/page-props.type'
import ExpirationCountDown from '../../../features/orders/components/ExpirationCountDown'
import StripeCheckout from 'react-stripe-checkout'

type PrivateProps = {
    order: TOrder
} & PageProps

const STRIPE_KEY =
    'pk_test_51NOezXAhgIqm5t2V6uuZYEpQCGsG6YIkyGlQUz06yOLOjIPpNxTv4cIUmL1xqZvr0MwhPCl3qvjHpCFoNJO1d3SW003tioeW2t'

function Order({ currentUser, order }: PrivateProps) {
    const router = useRouter()
    const [doRequest, errors] = useRequest(
        Endpoints.createPayment,
        Methods.POST,
        router.push.bind(null, '/orders')
    )

    return (
        <div className="flex column gap-large">
            <ExpirationCountDown expiresAt={order.expiresAt} />
            <StripeCheckout
                token={({ id }) => doRequest({ orderId: order.id, token: id })}
                stripeKey={STRIPE_KEY}
                amount={order.ticket.price * 100}
                email={currentUser.email}
            />
            <Errors errors={errors} />
        </div>
    )
}

Order.getInitialProps = async (context, client, currentUser) => {
    const { id } = context.query
    const { data } = await client.get(`/api/orders/${id}`)

    return { order: data }
}

export default Order
