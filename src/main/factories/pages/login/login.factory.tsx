import React from 'react'
import { Login } from '@/presentation/pages'
import { RemoteAuthentication } from '@/data/usecases/authentication/remote-authentication'
import { AxiosHttpClient } from '@/infra/http/axios-http-client/axios-http-client'
import { ValidationBuilder, ValidationComposite } from '@/validation/validators'

export const makeLoginPage: React.FC = () => {
  const axiosHttpClient = new AxiosHttpClient()
  const url = 'http://fordevs.herokuapp.com/api/login'
  const authentication = new RemoteAuthentication(axiosHttpClient, url)
  const validationComposite = ValidationComposite.build([
    ...ValidationBuilder.field('email').required().email().build(),
    ...ValidationBuilder.field('password').required().min(5).build()
  ])

  return (
    <Login
      authentication={authentication}
      validation={validationComposite}
    />
  )
}
