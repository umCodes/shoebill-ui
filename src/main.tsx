import { Provider as ChakraProvider } from "@/components/ui/provider"

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import LabProvider from "./providers/LabProvider.tsx"
import { RouterProvider } from "react-router-dom"
import { router } from "./router.tsx"
import AuthProvider from "./providers/AuthProvider.tsx"
import { Toaster } from "@/components/ui/toaster"
import QuizesProvider from "./providers/QuizesProvider.tsx"

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ChakraProvider>
            <LabProvider>
              <AuthProvider>
                <QuizesProvider>
                  <RouterProvider router={router}/>
                  <Toaster />
                </QuizesProvider>
              </AuthProvider>
            </LabProvider>
    </ChakraProvider>
  </StrictMode>,
)
