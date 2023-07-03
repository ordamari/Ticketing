import { useId } from 'react'
import { useToggle } from '../../../hooks/useToggle'
import { syncValidation } from '../../../validations/syncValidation'
import classes from './input.module.scss'
type PrivateProps = {
    value: string | number
    type?: 'text' | 'number' | 'password' | 'email'
    onChange: (value: string) => void
    placeholder?: string
    className?: string
    onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void
    onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void
}
function Input({
    onChange,
    onBlur,
    onFocus,
    value,
    type = 'text',
    placeholder,
    className,
}: PrivateProps) {
    const id = useId()
    const [isFocused, toggleIsFocused] = useToggle()
    const isValidString = syncValidation.isNotEmpty(value.toString())
    const isShowPlaceholder = !isFocused && !isValidString
    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        onChange(event.target.value)
    }

    function handleBlur(event: React.FocusEvent<HTMLInputElement>) {
        toggleIsFocused(false)
        if (onBlur) onBlur(event)
    }

    function handleFocus(event: React.FocusEvent<HTMLInputElement>) {
        toggleIsFocused(true)
        if (onFocus) onFocus(event)
    }

    return (
        <div
            className={`${classes['input-container']} ${
                className ? className : ''
            }`}
        >
            {placeholder && (
                <label
                    className={isShowPlaceholder ? classes.show : classes.hide}
                    htmlFor={id}
                >
                    {placeholder}
                </label>
            )}
            <input
                onFocus={handleFocus}
                onBlur={handleBlur}
                value={value}
                onChange={handleChange}
                id={id}
                type={type}
            />
        </div>
    )
}

export default Input
