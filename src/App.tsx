import AirdropDashboard from './components/AirdropDashboard'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './service/queryClient'
const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <div className='min-h-screen flex items-center justify-center'>
        <AirdropDashboard />
      </div>
    </QueryClientProvider>
  )
}

export default App
