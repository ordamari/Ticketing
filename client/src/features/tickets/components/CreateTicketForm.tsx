import { useState } from 'react'
import Button from '../../../common/components/ui/button/Button'
import Input from '../../../common/components/ui/input/Input'
import { Ticket } from '../../../common/types/ticket.type'
import useTranslation from '../../../common/hooks/useTranslation'
import { useToggle } from '../../../common/hooks/useToggle'

type PrivateProps = {
    onSubmit: (ticket: Partial<Ticket>) => void | Promise<void>
    title?: string
}

function CreateTicketForm({ onSubmit, title: FormTitle }: PrivateProps) {
    const [title, setTitle] = useState('')
    const [price, setPrice] = useState('0')
    const [isLoad, toggleIsLoad] = useToggle()
    const t = useTranslation()
    const isDisabled = !title || !Number(price) || isLoad

    const clearForm = () => {
        setTitle('')
        setPrice('0')
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (isDisabled) return
        toggleIsLoad(true)
        try {
            onSubmit({ title, price: Number(price) })
        } catch (error) {
            console.log(error)
        } finally {
            clearForm()
            toggleIsLoad(false)
        }
    }

    const handlePriceLimits = () => {
        const NumericPrice = Number(price)
        if (isNaN(NumericPrice) || NumericPrice < 0) setPrice('0')
        else setPrice(NumericPrice.toFixed(2))
    }

    return (
        <form className="flex column gap-large" onSubmit={handleSubmit}>
            {FormTitle && <h1>{FormTitle}</h1>}
            <Input
                value={title}
                type="text"
                onChange={setTitle}
                placeholder={t('tickets.titlePlaceholder')}
            />
            <Input
                value={price}
                onBlur={handlePriceLimits}
                type="number"
                onChange={setPrice}
                placeholder={t('tickets.pricePlaceholder')}
            />

            <Button className="bg-primary" disabled={isDisabled}>
                {t('tickets.submit')}
            </Button>
        </form>
    )
}

export default CreateTicketForm
