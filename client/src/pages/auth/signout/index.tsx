import { useEffect } from 'react'
import { useRequest } from '../../../common/hooks/useRequest'
import { Methods } from '../../../common/enums/methods.enum'
import { useRouter } from 'next/router'
import { Endpoints } from '../../../common/enums/endpoints.enum'

function Signout() {
    const router = useRouter()
    const [signout, errors] = useRequest(
        Endpoints.signout,
        Methods.POST,
        () => {
            router.push('/')
        }
    )

    useEffect(() => {
        signout()
    }, [])

    return <div>Signing out...</div>
}

export default Signout
