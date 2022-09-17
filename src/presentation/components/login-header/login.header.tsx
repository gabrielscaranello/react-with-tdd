import React, { memo } from 'react'
import Styles from './login-header.styles.sass'
import Logo from '@/presentation/components/logo/logo'

const LoginHeader: React.FC = () => {
  return (
    <header className={Styles.header}>
      <Logo />
      <h1>React with TDD</h1>
    </header>
  )
}

export default memo(LoginHeader)
