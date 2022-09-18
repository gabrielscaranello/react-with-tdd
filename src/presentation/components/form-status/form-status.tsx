import React, { useContext } from 'react'
import Styles from './form-status.styles.sass'
import Spinner from '@/presentation/components/spinner/spinner'
import { formContext } from '@/presentation/contexts'

const FormStatus: React.FC = () => {
  const { state } = useContext(formContext)
  const { mainError, isLoading } = state

  return (
    <div data-testid='error-wrap' className={Styles.errorWrap}>
      { isLoading && <Spinner className={Styles.spinner} /> }
      { mainError && <span className={Styles.error}> {mainError} </span> }
    </div>
  )
}

export default FormStatus
