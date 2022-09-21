import React, { useState, useEffect } from 'react'
import Styles from './login.styles.sass'
import { LoginHeader, Input, Button, FormStatus, Footer } from '@/presentation/components'
import { formContext } from '@/presentation/contexts'
import { Validation } from '@/presentation/protocols'
import { Authentication } from '@/domain/usecases'

type Props = {
  validation: Validation
  authentication: Authentication
}

const Login: React.FC<Props> = ({ validation, authentication }: Props) => {
  const [state, setState] = useState({
    email: '',
    password: '',
    isLoading: false,
    mainError: '',
    emailError: '',
    passwordError: ''
  })

  useEffect(() => {
    setState({
      ...state,
      emailError: validation.validate('email', state.email),
      passwordError: validation.validate('password', state.password)
    })
  }, [state.email, state.password])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()
    const { isLoading, emailError, passwordError } = state
    if (isLoading || emailError || passwordError) return

    setState({ ...state, isLoading: true })
    try {
      const { email, password } = state
      const account = await authentication.auth({ email, password })
      localStorage.setItem('accessToken', account.accessToken)
    } catch (error) {
      setState({
        ...state,
        isLoading: false,
        mainError: error.message
      })
    }
  }

  return (
    <div className={Styles.login}>
      <LoginHeader />
      <formContext.Provider value={{ state, setState }}>
        <form data-testid="form" className={Styles.form} onSubmit={handleSubmit}>
          <h2>Login</h2>

          <Input type='email' name='email' placeholder='Digite seu e-mail' />
          <Input type='password' name='password' placeholder='Digite sua senha' />
          <Button data-testid='submit' disabled={!!state.emailError || !!state.passwordError} className={Styles.submit} value='Entrar' />
          <span className={Styles.link}>Criar conta</span>

          <FormStatus />
        </form>
      </formContext.Provider>
      <Footer />
    </div>
  )
}

export default Login
