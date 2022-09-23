import React, { useContext } from 'react'
import Styles from './input.styles.sass'
import { FormContext } from '@/presentation/contexts'

type Props = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>

const Input: React.FC<Props> = (props: Props) => {
  const { state, setState } = useContext(FormContext)
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
    <input
      {...props as {}}
      readOnly
      onFocus={enableInput}
      onChange={handleChange}
      data-testid={props.name}
    />

    <span data-testid={`${props.name}-status`} title={getTitle()} className={getStatus()}></span>
  </div>
  )
}

export default Input
