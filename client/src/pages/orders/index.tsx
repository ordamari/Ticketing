import { Order } from '../../common/types/order.type'
import { PageProps } from '../../common/types/page-props.type'
import OrderList from '../../features/orders/components/OrderList'

type PrivateProps = {
    orders: Order[]
} & PageProps

function MyOrders({ currentUser, orders }: PrivateProps) {
    console.log({ orders })

    return (
        <div className="my-orders">
            <OrderList orders={orders} />
        </div>
    )
}

MyOrders.getInitialProps = async (context, client, currentUser) => {
    const { data } = await client.get('/api/orders')
    return { orders: data }
}

export default MyOrders
