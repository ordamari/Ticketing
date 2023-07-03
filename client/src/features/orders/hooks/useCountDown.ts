import { useEffect, useMemo, useRef, useState } from 'react'

export function useCountDown(expiresAt: string | null) {
    const expiresAtDate = useMemo(() => new Date(expiresAt), [expiresAt])
    const [now, setNow] = useState(new Date())
    const timeOutRef = useRef(0)
    const timeLeftInSeconds = useMemo(
        () => Math.round((expiresAtDate.getTime() - now.getTime()) / 1000),
        [expiresAtDate, now]
    )

    useEffect(() => {
        timeOutRef.current = window.setTimeout(() => {
            setNow(new Date())
        }, 500)

        return () => {
            window.clearTimeout(timeOutRef.current)
        }
    }, [now])

    return timeLeftInSeconds
}
