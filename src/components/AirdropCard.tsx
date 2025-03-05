/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import Loader from './Loader'
import { formatTokenAmount } from '@/utils/helpers'
import axios from 'axios'

export default function AirdropCard({ airdrop, isPress, loading }: any) {
  const [isOpen, setIsOpen] = useState(false)
  const [solPrice, setSolPrice] = useState<number | null>(null)

  // Fetch SOL Price
  useEffect(() => {
    const fetchSolPrice = async () => {
      try {
        const response = await axios.get(
          `https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd`
        )
        setSolPrice(response.data.solana.usd)
      } catch (error) {
        console.error('Error fetching SOL price:', error)
      }
    }

    fetchSolPrice()
  }, [])

  // Convert totalAmountLocked to SOL
  const totalSol = formatTokenAmount(airdrop?.totalAmountLocked?.toString(), 9)
  const totalUsd = solPrice
    ? (parseFloat(totalSol) * solPrice).toFixed(2)
    : 'Loading...'

    console.log(JSON.stringify(airdrop, null, 2))
    return (
      <div>
        {loading ? (
          <Loader />
        ) : (
          <div
            className='border p-4 rounded-md shadow-md bg-white text-black w-full text-center cursor-pointer hover:bg-gray-200 transition'
            onClick={() => setIsOpen(true)}
          >
            <p className='text-[8px] mb-2 mt-2'>
              <strong>Airdrop ID:</strong>
              <br />
              {airdrop?.address?.toString() || airdrop?.publicKey?.toString()}
            </p>
            <p className='text-xs mb-2 mt-2'>
              <strong>Total Amount:</strong>{' '}
              {formatTokenAmount(airdrop?.totalAmountLocked?.toString(), 9)} Sol
            </p>
            <p className='text-xs mb-2 mt-2'>
              <strong>USD Value:</strong> $ {totalUsd}
            </p>
            <div className='mt-3 mb-3' />
            {airdrop?.address?.toString() && (
              <Button onClick={isPress} variant='destructive'>
                CLAIM
              </Button>
            )}
          </div>
        )}
        {/* Modal (Dialog) */}
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent>
            <DialogTitle>Airdrop Details</DialogTitle>
            <p>
              <strong>Airdrop ID:</strong>{' '}
              {airdrop?.address?.toString() || airdrop?.publicKey?.toString()}
            </p>
            <p>
              <strong>Total Amount:</strong>{' '}
              {formatTokenAmount(airdrop?.totalAmountLocked?.toString(), 9)}{' '}
              Tokens
            </p>
            <p>
              <strong>Total Amount In USD:</strong> $ {totalUsd}
            </p>
            <p>
              <strong>Chain:</strong> {airdrop?.chain?.toString()}
            </p>
            <p>
              <strong>Airdrop Name:</strong> {airdrop?.name?.toString()}
            </p>
            <p>
              <strong>Mint:</strong> {airdrop?.mint?.toString()}
            </p>
            <p>
              <strong>Version:</strong>{' '}
              {airdrop?.version?.toString() ||
                airdrop?.account?.version?.toString()}
            </p>
            <p>
              <strong>MaxNodes:</strong> {airdrop?.maxNumNodes?.toString()}
            </p>
            <p>
              <strong>Max Claim:</strong>{' '}
              {formatTokenAmount(
                airdrop?.maxTotalClaim?.toString() ||
                  airdrop?.maxTotalClaim?.toString(),
                9
              )}{' '}
              Sol
            </p>
            <p>
              <strong>Active:</strong> {airdrop?.isActive?.toString()}
            </p>
            <p>
              <strong>Verified:</strong> {airdrop?.isVerified?.toString()}
            </p>
            <DialogFooter>
              {airdrop?.address?.toString() && (
                <DialogClose asChild>
                  <Button
                    onClick={isPress}
                    className='bg-red-500 hover:bg-red-600'
                  >
                    CLAIM
                  </Button>
                </DialogClose>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    )
}
