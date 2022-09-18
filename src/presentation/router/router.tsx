import React from 'react'
import { Login } from '@/presentation/pages'
import { createBrowserRouter } from 'react-router-dom'

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />
  }
])

export default router
