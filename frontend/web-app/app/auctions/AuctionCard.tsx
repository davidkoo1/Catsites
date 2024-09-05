import React from 'react'
import CoutdownTimer from './CountdownTimer'
import CarImage from './CarImage'
import { Auction } from '@/types'
import Link from 'next/link'
import CurrentBid from './CurrentBid'

type Props = {
    auction: Auction
}

/* Add in right-top current price
?mb number of car?
*/
export default function AuctionCard({ auction }: Props) {
    return (
        <Link href={`/auctions/details/${auction.id}`} className='group'>
            <div className='card'>
                <div className='w-full bg-gray-800 aspect-w-16 aspect-h-10 rounded-lg overflow-hidden'>
                    <div>
                        <CarImage imageUrl={auction.imageUrl} />
                        <div className='absolute bottom-2 left-2'>
                            <CoutdownTimer auctionEnd={auction.auctionEnd} />
                        </div>
                        <div className='absolute top-2 right-2'>
                            <CurrentBid reservePrice={auction.reservePrice} amount={auction.currentHighBid} />
                        </div>
                        {/*Here price or down no on image
                         <div className='absolute top-2 right-2 text-gray-950'>
                            price
                        </div> */}
                    </div>
                </div>
            </div>
            <div className='flex justify-between items-center mt-3'>
                <h3 className='text-gray-200'>{auction.make} {auction.model}</h3>
                <p className='font-semibold text-sm'>{auction.year}</p>
            </div>

        </Link>
    )
}
