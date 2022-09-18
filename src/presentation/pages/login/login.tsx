import React, { useState } from 'react'
import Styles from './login.styles.sass'
import { LoginHeader, Input, Button, FormStatus, Footer } from '@/presentation/components'
import { formContext } from '@/presentation/contexts'

const Login: React.FC = () => {
  const [state] = useState({
    isLoading: false
  })

  const [errorState] = useState({
    main: '',
    email: 'Campo obrigatório',
    password: 'Campo obrigatório'
  })

  return (
    <div className={Styles.login}>
      <LoginHeader />
      <formContext.Provider value={{ state, errorState }}>
        <form className={Styles.form}>
          <h2>Login</h2>

          <Input type='email' name='email' placeholder='Digite seu e-mail' />
          <Input type='password' name='password' placeholder='Digite sua senha' />
          <Button data-testid='submit' disabled className={Styles.submit} value='Entrar' />
          <span className={Styles.link}>Criar conta</span>

          <FormStatus />
        </form>
      </formContext.Provider>
      <Footer />
    </div>
  )
}

export default Login
