import { RouterProvider } from 'react-router-dom'
import React from 'react'
import ReactDOM from 'react-dom/client'
import router from '@/presentation/router/router'
import '@/presentation/styles/global.sass'

ReactDOM.createRoot(document.getElementById('main')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
