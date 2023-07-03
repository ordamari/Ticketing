import { useRouter } from 'next/router'
import Errors from '../../../common/components/ui/errors/Errors'
import { Methods } from '../../../common/enums/methods.enum'
import { useRequest } from '../../../common/hooks/useRequest'
import useTranslation from '../../../common/hooks/useTranslation'
import AuthCredentialsForm from '../../../features/auth/components/AuthCredentialsForm'
import { Endpoints } from '../../../common/enums/endpoints.enum'
function Signup() {
    const t = useTranslation()
    const router = useRouter()
    const [signUp, errors] = useRequest(Endpoints.signup, Methods.POST, () => {
        router.push('/')
    })

    return (
        <div className="flex column gap-large">
            <AuthCredentialsForm title={t('auth.signup')} onSubmit={signUp} />
            <Errors errors={errors} />
        </div>
    )
}
export default Signup
