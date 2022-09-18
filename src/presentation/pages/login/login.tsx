import React from 'react'
import Styles from './login.styles.sass'
import { LoginHeader, Input, Button, FormStatus, Footer } from '@/presentation/components'

const Login: React.FC = () => {
  return (
    <div className={Styles.login}>
      <LoginHeader />
      <form className={Styles.form}>
        <h2>Login</h2>

        <Input type='email' name='email' placeholder='Digite seu e-mail' />
        <Input type='password' name='password' placeholder='Digite sua senha' />
        <Button className={Styles.submit} value='Entrar' />
        <span className={Styles.link}>Criar conta</span>

        <FormStatus />
      </form>
      <Footer />
    </div>
  )
}

export default Login
