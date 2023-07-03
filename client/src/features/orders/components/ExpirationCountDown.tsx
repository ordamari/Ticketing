import useTranslation from '../../../common/hooks/useTranslation'
import { useCountDown } from '../hooks/useCountDown'

type PrivateProps = {
    expiresAt: string
}

function ExpirationCountDown({ expiresAt }: PrivateProps) {
    const t = useTranslation()
    const timeLeftInSeconds = useCountDown(expiresAt)
    if (timeLeftInSeconds > 0)
        return (
            <div>
                {t('orders.timeLeft')}: {timeLeftInSeconds}{' '}
                {t('orders.seconds')}
            </div>
        )
    else return <div>{t('orders.expired')}</div>
}
export default ExpirationCountDown
