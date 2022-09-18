import React, { useContext } from 'react'
import Styles from './input.styles.sass'
import { formContext } from '@/presentation/contexts'

type Props = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>

const Input: React.FC<Props> = (props: Props) => {
  const { errorState } = useContext(formContext)
  const error = errorState[props.name]

  const getStatus = (): string => {
    return [Styles.status, Styles.statusError].join(' ')
  }

  const getTitle = (): string => {
    return error
  }

  const enableInput = (event: React.FocusEvent<HTMLInputElement>): void => {
    event.target.readOnly = false
  }

  return (
  <div className={Styles.inputWrap}>
    <input {...props} readOnly onFocus={enableInput} />
    <span data-testid={`${props.name}-status`} title={getTitle()} className={getStatus()}></span>
  </div>
  )
}

export default Input
