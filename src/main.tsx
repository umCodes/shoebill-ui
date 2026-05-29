import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AuthProvider from './providers/AuthProvider.tsx'
import LabProvider from './providers/LabProvider.tsx'
import { RouterProvider } from 'react-router-dom'
import { router } from './router.tsx'
import QuizesProvider from './providers/QuizesProvider.tsx'
import { ToastProvider } from './providers/TostProvider.tsx'
import { ConfirmProvider } from './providers/ConfirmProvider.tsx'
import { ThemeProvider } from './providers/ThemeProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <ConfirmProvider>
        <ToastProvider>
            <LabProvider>
              <AuthProvider>
                <QuizesProvider>
                    <RouterProvider router={router}/>
                </QuizesProvider>
              </AuthProvider>
            </LabProvider>
        </ToastProvider>
      </ConfirmProvider>
    </ThemeProvider>
  </StrictMode>,
)

