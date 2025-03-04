import { useState, useEffect } from 'react'
import {
  Toast,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from '@radix-ui/react-toast'
import { Copy } from 'lucide-react'

const WalletToast = ({
  walletAddress,
  show,
  onClose,
}: {
  walletAddress: string
  show: boolean
  onClose: () => void
}) => {
  const [open, setOpen] = useState(show)

  useEffect(() => {
    setOpen(show)
  }, [show])

  const shortenAddress = (address: string) =>
    `${address.slice(0, 5)}...${address.slice(-4)}`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(walletAddress)
    alert('Wallet address copied to clipboard!')
  }

  return (
    <ToastProvider>
      <Toast
        open={open}
        onOpenChange={setOpen}
        className='bg-gray-800 text-white p-4 rounded-lg shadow-lg flex items-center space-x-3'
      >
        <div className='bg-blue-800 text-blue-200 p-2 rounded-lg'>
          <Copy className='w-5 h-5 cursor-pointer' onClick={copyToClipboard} />
        </div>
        <div className='flex flex-col'>
          <ToastTitle className='font-bold text-lg'>
            Wallet Connected
          </ToastTitle>
          <ToastDescription>{shortenAddress(walletAddress)}</ToastDescription>
        </div>
        <button
          onClick={onClose}
          className='ml-auto text-gray-400 hover:text-white'
        >
          ✕
        </button>
      </Toast>
      <ToastViewport />
    </ToastProvider>
  )
}

export default WalletToast
