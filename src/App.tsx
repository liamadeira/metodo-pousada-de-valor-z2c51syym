import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import Index from './pages/Index'
import Properties from './pages/Properties'
import Costs from './pages/Costs'
import Commercial from './pages/Commercial'
import Operations from './pages/Operations'
import Simulator from './pages/Simulator'
import Setup from './pages/Setup'
import NotFound from './pages/NotFound'
import Layout from './components/Layout'
import { AppStoreProvider } from './stores/use-app-store'

const App = () => (
  <AppStoreProvider>
    <BrowserRouter>
      <TooltipProvider delayDuration={300}>
        <Toaster />
        <Sonner />
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Index />} />
            <Route path="/properties" element={<Properties />} />
            <Route path="/costs" element={<Costs />} />
            <Route path="/commercial" element={<Commercial />} />
            <Route path="/operations" element={<Operations />} />
            <Route path="/simulator" element={<Simulator />} />
            <Route path="/setup" element={<Setup />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </BrowserRouter>
  </AppStoreProvider>
)

export default App
