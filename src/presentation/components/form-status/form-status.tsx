import React, { useContext } from 'react'
import Styles from './form-status.styles.sass'
import Spinner from '@/presentation/components/spinner/spinner'
import { formContext } from '@/presentation/contexts'

const FormStatus: React.FC = () => {
  const { state, errorState } = useContext(formContext)
  const { main } = errorState

  return (
    <div data-testid='error-wrap' className={Styles.errorWrap}>
      { state.isLoading && <Spinner className={Styles.spinner} /> }
      { main && <span className={Styles.error}> {main} </span> }
    </div>
  )
}

export default FormStatus
