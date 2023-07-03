import { Order } from '../../../common/types/order.type'
import OrderPreview from './OrderPreview'

type PrivateProps = {
    orders: Order[]
}

function OrderList({ orders }: PrivateProps) {
    return (
        <div className="order-list">
            {orders.map((order) => (
                <OrderPreview key={order.id} order={order} />
            ))}
        </div>
    )
}

export default OrderList
