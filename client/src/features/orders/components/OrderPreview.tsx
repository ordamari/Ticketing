import { Order } from '../../../common/types/order.type'

type PrivateProps = {
    order: Order
}

function OrderPreview({ order }: PrivateProps) {
    const ticketTitle = order.ticket.title
    return (
        <div className="order-preview">
            {ticketTitle} - {order.status}
        </div>
    )
}

export default OrderPreview
