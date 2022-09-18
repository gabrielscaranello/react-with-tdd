import React, { useContext } from 'react'
import Styles from './form-status.styles.sass'
import Spinner from '@/presentation/components/spinner/spinner'
import { formContext } from '@/presentation/contexts'

const FormStatus: React.FC = () => {
  const { isLoading, errorMessage } = useContext(formContext)

  return (
    <div data-testid='error-wrap' className={Styles.errorWrap}>
      { isLoading && <Spinner className={Styles.spinner} /> }
      { errorMessage && <span className={Styles.error}> {errorMessage} </span> }
    </div>
  )
}

export default FormStatus
