import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { TripProvider } from './features/trip/TripContext.jsx'
import { BrowserRouter } from 'react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1 } },
})

// TripCraft has no real trips backend, so the in-browser mock trips API runs in every build.
async function enableMocking() {
  const { worker } = await import('./mocks/browser.js')
  await worker.start({ onUnhandledRequest: 'bypass' })
}

enableMocking().then(() => {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <TripProvider>
            <App />
          </TripProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </StrictMode>,
  )
})
