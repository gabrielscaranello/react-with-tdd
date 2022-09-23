import React from 'react'

import { makeLoginValidation } from './login-validation-factory'
import { makeRemoteAutentication } from '@/main/factories/usecases/authentication/remote-authentication-factory'
import { Login } from '@/presentation/pages'

export const makeLoginPage: React.FC = () => {
  return (
    <Login
      authentication={makeRemoteAutentication()}
      validation={makeLoginValidation()}
    />
  )
}
