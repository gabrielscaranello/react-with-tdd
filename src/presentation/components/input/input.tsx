import React, { useContext } from 'react'
import Styles from './input.styles.sass'
import { formContext } from '@/presentation/contexts'

type Props = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>

const Input: React.FC<Props> = (props: Props) => {
  const { state, setState } = useContext(formContext)
  const error = state[`${props.name}Error`]

  const getStatus = (): string => {
    return [
      Styles.status,
      error ? Styles.statusError : Styles.statusSuccess
    ].join(' ')
  }

  const getTitle = (): string => {
    return error || 'Tudo certo!'
  }

  const enableInput = (event: React.FocusEvent<HTMLInputElement>): void => {
    event.target.readOnly = false
  }

  const handleChange = (event: React.FocusEvent<HTMLInputElement>): void => {
    setState({ ...state, [event.target.name]: event.target.value })
  }

  return (
  <div className={Styles.inputWrap}>
    <input data-testid={props.name} {...props} readOnly onFocus={enableInput} onChange={handleChange} />
    <span data-testid={`${props.name}-status`} title={getTitle()} className={getStatus()}></span>
  </div>
  )
}

export default Input
