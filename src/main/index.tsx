import React from 'react'
import ReactDOM from 'react-dom'

import Router from '@/presentation/router/router'
import { makeLoginPage } from './factories/pages/login/login.factory'
import '@/presentation/styles/global.sass'

ReactDOM.render(
  <Router
    makeLogin={makeLoginPage}
  />,
  document.getElementById('main')
)
