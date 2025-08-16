import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import { ThemeProvider } from 'next-themes'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <HelmetProvider>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <TooltipProvider>
        <App />
        <Toaster />
        <Sonner />
      </TooltipProvider>
    </ThemeProvider>
  </HelmetProvider>
)
