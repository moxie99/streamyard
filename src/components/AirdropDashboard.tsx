/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react'
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js'
import Button from './button'

const AirdropDashboard: React.FC = () => {
  const [wallet, setWallet] = useState<any>(null)
  const [airdropId, setAirdropId] = useState('')
  const [airdropDetails, setAirdropDetails] = useState<any>(null)
  const [connection, setConnection] = useState<Connection | null>(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    setConnection(new Connection(clusterApiUrl('devnet'), 'confirmed'))
  }, [])

  const connectWallet = async () => {
    if (!window.solana || !window.solana.isPhantom) {
      setShowModal(true)
      return
    }
    try {
      const provider = window.solana
      await provider.connect()
      setWallet(provider)
      console.log('Wallet connected:', provider.publicKey.toString())
    } catch (err) {
      console.error('Connection failed:', err)
    }
  }

  const fetchAirdropDetails = async () => {
    const data = {
      type: 'Instant',
      totalRecipients: 100,
      claimedRecipients: 50,
      totalAmount: 10000,
      claimedAmount: 5000,
      userAmount: 100,
    }
    setAirdropDetails(data)
  }

  console.log(wallet?.publicKey?.toString())
  return (
    <div className='p-6 max-w-6xl mx-auto w-full'>
      <div className='grid grid-cols-1 lg:grid-cols-10 gap-6 lg:flex lg:space-x-6'>
        <div className='lg:w-1/3 w-full'>
          <h1 className='text-2xl font-bold mb-4'>Streamflow Airdrop</h1>
          {!wallet ? (
            <Button onClick={connectWallet}>Connect Phantom Wallet</Button>
          ) : (
            <>
              <p className='text-green-600 font-bold'>
                Connected: {wallet.publicKey?.toString()}
              </p>
              <input
                type='text'
                value={airdropId}
                onChange={(e) => setAirdropId(e.target.value)}
                placeholder='Enter Airdrop ID'
                className='border border-red-500 p-2 rounded w-full mt-4'
              />
              <div className='mt-4 flex flex-col md:flex-row md:space-x-2'>
                <Button onClick={fetchAirdropDetails} className='mb-2 md:mb-0'>
                  Fetch Airdrop
                </Button>
                <Button
                  onClick={() => setWallet(null)}
                  className='bg-red-600 hover:bg-red-700'
                >
                  Disconnect
                </Button>
              </div>
            </>
          )}
        </div>
        <div className='lg:w-2/3 w-full'>
          {airdropDetails && (
            <div className='border p-4 rounded'>
              <p>Type: {airdropDetails.type}</p>
              <p>
                Recipients: {airdropDetails.claimedRecipients} /{' '}
                {airdropDetails.totalRecipients}
              </p>
              <p>
                Amount: {airdropDetails.claimedAmount} /{' '}
                {airdropDetails.totalAmount} Tokens
              </p>
              <p>Your Amount: {airdropDetails.userAmount} Tokens</p>
              {airdropDetails.userAmount > 0 && (
                <Button className='mt-2'>Claim</Button>
              )}
            </div>
          )}
        </div>
      </div>
      {showModal && (
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
          <div className='bg-white p-6 rounded shadow-md'>
            <h2 className='text-lg font-bold'>Phantom Wallet Not Found</h2>
            <p>Please install Phantom Wallet to continue.</p>
            <div className='mt-4 flex justify-end space-x-4'>
              <Button
                onClick={() => setShowModal(false)}
                className='bg-gray-400 hover:bg-gray-500'
              >
                Cancel
              </Button>
              <a
                href='https://phantom.app/'
                target='_blank'
                rel='noopener noreferrer'
              >
                <Button className='bg-blue-600 hover:bg-blue-700'>
                  Download Phantom
                </Button>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AirdropDashboard
