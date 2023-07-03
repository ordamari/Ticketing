import { useState } from 'react'
import Input from '../../../common/components/ui/input/Input'
import useTranslation from '../../../common/hooks/useTranslation'
import Button from '../../../common/components/ui/button/Button'
import { useToggle } from '../../../common/hooks/useToggle'
import { syncValidation } from '../../../common/validations/syncValidation'

type Credentials = {
    email: string
    password: string
}

type PrivateProps = {
    title?: string
    onSubmit: (credentials: Credentials) => void | Promise<void>
}

function AuthCredentialsForm({ title = '', onSubmit }: PrivateProps) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isLoad, toggleIsLoad] = useToggle()
    const t = useTranslation()
    const isDisabled =
        !syncValidation.isEmailValid(email) || !password || isLoad

    const clearForm = () => {
        setEmail('')
        setPassword('')
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (isDisabled) return
        toggleIsLoad(true)
        try {
            await onSubmit({ email, password })
            clearForm()
        } finally {
            toggleIsLoad(false)
        }
    }

    return (
        <form className="flex column gap-large" onSubmit={handleSubmit}>
            {title && <h1>{title}</h1>}
            <Input
                value={email}
                type="email"
                onChange={setEmail}
                placeholder={t('auth.emailPlaceholder')}
            />
            <Input
                value={password}
                type="password"
                onChange={setPassword}
                placeholder={t('auth.passwordPlaceholder')}
            />

            <Button className="bg-primary" disabled={isDisabled}>
                {t('auth.submit')}
            </Button>
        </form>
    )
}
export default AuthCredentialsForm
