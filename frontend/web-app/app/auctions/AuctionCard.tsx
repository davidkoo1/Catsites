import React, { useEffect, useState } from 'react';
import CountdownTimer from './CountdownTimer';
import CarImage from './CarImage';
import { Auction } from '@/types';
import Link from 'next/link';
import CurrentBid from './CurrentBid';
import { FaFire, FaHeart, FaRegClock } from 'react-icons/fa';
import { getBidsForAuction } from '../actions/auctionActions';

type Props = {
    auction: Auction;
}

export default function AuctionCard({ auction }: Props) {
    const [bidCount, setBidCount] = useState<number | null>(null);

    useEffect(() => {
        async function fetchBids() {
            try {
                const bids = await getBidsForAuction(auction.id);
                setBidCount(bids.length);
            } catch (error) {
                console.error('Error fetching bids:', error);
            }
        }
        fetchBids();
    }, [auction.id]);

    const now = new Date();
    const auctionEndDate = new Date(auction.auctionEnd);
    const timeLeft = auctionEndDate.getTime() - now.getTime();
    const hoursLeft = Math.ceil(timeLeft / (1000 * 60 * 60));

    return (
        <Link href={`/auctions/details/${auction.id}`} className='group'>
            <div className='card'>
                <div className='w-full bg-gray-800 aspect-w-16 aspect-h-10 rounded-lg overflow-hidden'>
                    <div>
                        <CarImage imageUrl={auction.imageUrl} />
                        <div className='absolute bottom-2 left-2'>
                            <CountdownTimer auctionEnd={auction.auctionEnd} />
                        </div>
                        <div className='absolute top-2 right-2'>
                            <CurrentBid reservePrice={auction.reservePrice} amount={auction.currentHighBid} />
                        </div>
                            <div className='absolute top-2 left-2 flex space-x-2'>
                                {auction.isInWishlist && (
                                    <div className={`border-2 border-white text-white py-1 px-2 rounded-lg flex items-center justify-center bg-red-300`}>
                                        <FaHeart />
                                    </div>
                                )}
                                {hoursLeft <= 6 && hoursLeft > 0 && (
                                    <div className={`border-2 border-gray-600 text-gray-600 py-1 px-2 rounded-lg flex items-center bg-gray-300`}>
                                        <FaRegClock className='text-gray-700' />
                                    </div>
                                )}
                                {bidCount !== null && bidCount > 10 && (
                                    <div className={`border-2 border-orange-300 text-orange-500 py-1 px-2 rounded-lg flex items-center justify-center bg-amber-500`}>
                                        <FaFire className='text-white' />
                                    </div>
                                )}
                            </div>
                    </div>
                </div>
            </div>
            <div className='flex justify-between items-center mt-3'>
                <h3 className='text-gray-200'>{auction.make} {auction.model}</h3>
                <p className='font-semibold text-sm'>{auction.year}</p>
            </div>
        </Link>
    );
}
