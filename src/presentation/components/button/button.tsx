import React from 'react'
import Styles from './button.styles.sass'

type Props = React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>

const Button: React.FC<Props> = (props: Props) => {
  return (
    <button {...props} className={[Styles.button, props.className].join(' ')}> {props.value} </button>
  )
}

export default Button
