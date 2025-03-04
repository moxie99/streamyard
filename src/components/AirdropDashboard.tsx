/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react'
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js'
import Button from './button'
import { ICluster } from '@streamflow/common'
import { Copy } from 'lucide-react'
import { SolanaDistributorClient } from '@streamflow/distributor/solana'
import BN from 'bn.js'
import AirdropCard from './AirdropCard'
import Loader from './Loader'
import { apiService } from '@/service/api'
import WalletToast from './Toast'
const AirdropDashboard: React.FC = () => {
  const [wallet, setWallet] = useState<any>(null)
  const [showToast, setShowToast] = useState(false)
  const [airdropId, setAirdropId] = useState('')
  const [allAirdrops, setAllAirdrops] = useState<any[]>([])
  const [connection, setConnection] = useState<Connection | null>(null)
  const [allStreams, setAllStreams] = useState<any[]>([])
  const [showModal, setShowModal] = useState(false)
  const [client, setClient] = useState<SolanaDistributorClient | null>(null)
  const [filteredAirdrops, setFilteredAirdrops] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  const clusterUrl = import.meta.env.VITE_CLUSTER_URL
  useEffect(() => {
    setConnection(new Connection(clusterApiUrl('devnet'), 'confirmed'))
    setClient(
      new SolanaDistributorClient({
        clusterUrl: `${clusterUrl}`,
        cluster: ICluster.Devnet,
      })
    )
  }, [])
  const connectWallet = async () => {
    if (!window.solana || !window.solana.isPhantom) {
      setShowModal(true)
      return
    }

    try {
      setLoading(true)
      const provider = window.solana
      await provider.disconnect() // Ensure login prompt appears
      const response = await provider.connect({ onlyIfTrusted: false })

      setWallet(response)
      setShowToast(true) // Show toast on successful login
    } catch (err) {
      console.error('Connection failed:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchAllAirdrops = async () => {
    if (!client || !wallet) return
    try {
      setLoading(true)
      const params = {}
      const distributors = await client.searchDistributors(params)
      setFilteredAirdrops(distributors)
    } catch (error) {
      console.error('Error fetching airdrops:', error)
    } finally {
      setLoading(false)
    }
  }
  const claimAirdrop = async (airdropItem: any) => {
    if (!client || !wallet || !airdropItem) return
    try {
      setLoading(true)
      const solanaParams = { invoker: wallet }
      const claimRes = await client.claim(
        {
          id: airdropItem?.address?.toString(),
          proof: airdropItem?.merkleRoot,
          amountUnlocked: new BN(airdropItem?.totalAmountUnlocked?.toString()),
          amountLocked: new BN(airdropItem?.totalAmountLocked?.toString()),
        },
        solanaParams
      )
      console.log('Claim Result:', claimRes)
      alert('Airdrop Claimed Successfully!')
    } catch (error) {
      console.error('Error claiming airdrop:', error)
    } finally {
      setLoading(false)
    }
  }

  const createAirdrops = async () => {
    if (!client || !wallet) {
      console.log('Skipping airdrop creation - client or wallet missing.')
      return
    }
    try {
      console.log('Starting airdrop creation...')
      const now = Math.floor(Date.now() / 1000)
      const solanaParams = { invoker: wallet }
      const airdropPromises = Array.from({ length: 10 }, async (_, index) => {
        return client.create(
          {
            mint: 'Gssm3vfi8s65R31SBdmQRq6cKeYojGgup7whkw4VCiQj',
            version: now + index,
            root: new Array(32)
              .fill(0)
              .map(() => Math.floor(Math.random() * 256)),
            maxNumNodes: 4,
            maxTotalClaim: new BN('4000000000'),
            unlockPeriod: 1,
            startVestingTs: now,
            endVestingTs: now + 3600 * 24 * 7,
            clawbackStartTs: now + 5,
            claimsClosableByAdmin: false,
            claimsClosableByClaimant: false,
            claimsLimit: null,
          },
          solanaParams
        )
      })
      const results = await Promise.all(airdropPromises)
      console.log('Airdrops created: ===>>>>>>>>', results)
    } catch (error) {
      console.error('Error creating airdrops:', error)
    }
  }

  useEffect(() => {
    fetchAllAirdrops()
  }, [wallet])

  const fetchAirdropByAddress = async () => {
    if (!airdropId) {
      console.log('Please enter an address.')
      return
    }
    try {
      setLoading(true)
      const response = await apiService.get<any>('', { addresses: airdropId })
      setFilteredAirdrops(response)
    } catch (error) {
      console.error('Error fetching airdrop:', error)
    } finally {
      setLoading(false)
    }
  }

  const shortenAddress = (address: string) => {
    return address ? `${address.slice(0, 5)}...${address.slice(-4)}` : ''
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert('Wallet address copied to clipboard!')
  }

  return (
    <div className='flex flex-col lg:flex-row w-full h-screen'>
      {/* Left Section - Connect Wallet */}
      <div className='w-full lg:w-1/2 h-1/2 lg:h-full flex flex-col items-center justify-center bg-gray-900 text-white p-6'>
        <h1 className='text-3xl font-bold mb-4'>Streamflow Airdrop</h1>
        {!wallet ? (
          <Button
            onClick={connectWallet}
            className='bg-blue-500 hover:bg-blue-600 p-3 rounded-md'
          >
            Connect Phantom Wallet
          </Button>
        ) : (
          <>
            <p className='text-green-500 font-bold mb-4 flex items-center space-x-2'>
              Connected: {shortenAddress(wallet?.publicKey?.toString() || '')}
              <Copy
                className='w-5 h-5 cursor-pointer hover:text-green-300 transition'
                onClick={() =>
                  copyToClipboard(wallet?.publicKey?.toString() || '')
                }
              />
            </p>
            <input
              type='text'
              value={airdropId}
              onChange={(e) => setAirdropId(e.target.value)}
              placeholder='Enter Airdrop ID'
              className='border border-gray-400 p-3 rounded-md w-3/4 mb-4 text-white'
            />
            <div className='flex flex-col space-y-2 md:space-y-0 md:flex-row md:space-x-2'>
              <Button
                className='bg-green-500 hover:bg-green-600'
                onClick={fetchAirdropByAddress}
              >
                Fetch Airdrop
              </Button>
              <Button
                onClick={() => {
                  setWallet(null)
                  setFilteredAirdrops([]) // Clear filtered airdrops
                  setAllAirdrops([]) // Clear all airdrops
                }}
                className='bg-red-600 hover:bg-red-700'
              >
                Disconnect
              </Button>
            </div>
          </>
        )}
      </div>

      {/* Right Section - Airdrop Display */}
      <div className='w-full lg:w-1/2 h-1/2 lg:h-full flex flex-col items-center bg-gray-800 text-white p-6'>
        {loading ? (
          <div className='flex items-center justify-center h-full'>
            <Loader />
          </div>
        ) : filteredAirdrops?.length > 0 ? (
          <div className='w-full max-h-[80vh] overflow-y-auto scrollbar-hidden grid grid-cols-1 md:grid-cols-2 gap-6'>
            {filteredAirdrops?.map((airdrop, index) => (
              <AirdropCard
                key={index}
                airdrop={airdrop}
                isPress={() => claimAirdrop(airdrop)}
                loading={loading}
              />
            ))}
          </div>
        ) : (
          <p className='text-gray-400 text-lg'>
            No airdrops available right now.
          </p>
        )}
        {wallet && showToast && (
          <WalletToast
            walletAddress={wallet.publicKey.toString()}
            show={showToast}
            onClose={() => setShowToast(false)}
          />
        )}
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
