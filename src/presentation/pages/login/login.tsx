import React from 'react'
import Styles from './login.styles.sass'
import Header from '@/presentation/components/login-header/login.header'
import Footer from '@/presentation/components/footer/footer'
import Input from '@/presentation/components/input/input'
import FormStatus from '@/presentation/components/form-status/form-status'
import Button from '@/presentation/components/button/button'

const Login: React.FC = () => {
  return (
    <div className={Styles.login}>
      <Header />
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
