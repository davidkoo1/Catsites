'use client'

import { getBidsForAuction } from '@/app/actions/auctionActions'
import Heading from '@/app/components/Heading'
import { useBidStore } from '@/hooks/useBidStore'
import { Auction, Bid } from '@/types'
import { User } from 'next-auth'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import BidItem from './BidItem'
import { numberWithCommas } from '@/app/lib/numberWithComma'
import EmptyFilter from '@/app/components/EmptyFilter'
import BidForm from './BidForm'

type Props = {
    user: User | null
    auction: Auction
}

export default function BidList({ user, auction }: Props) {
    const [loading, setLoading] = useState(true);
    const bids = useBidStore(state => state.bids);
    const setBids = useBidStore(state => state.setBids);
    const open = useBidStore(state => state.open);
    const setOpen = useBidStore(state => state.setOpen);
    const openForBids = new Date(auction.auctionEnd) > new Date();

    // Calculate highest bid and bidder
    const { highBid, highBidder } = bids.reduce((acc, current) => {
        if (current.bidStatus.includes('Accepted') && current.amount > acc.highBid) {
            return {
                highBid: current.amount,
                highBidder: current.bidder
            };
        }
        return acc;
    }, { highBid: 0, highBidder: '' });

    useEffect(() => {
        getBidsForAuction(auction.id)
            .then((res: any) => {
                if (res.error) {
                    throw res.error
                }
                setBids(res as Bid[]);
            })
            .catch(err => {
                toast.error(err.message);
            })
            .finally(() => setLoading(false));
    }, [auction.id, setBids]);

    useEffect(() => {
        setOpen(openForBids);
    }, [openForBids, setOpen]);

    if (loading) return <span>Loading bids...</span>

    return (
        <div className='border-2 rounded-lg p-2 bg-gray-100'>
            <div className='py-2 px-4'>
                <div className='flex items-center justify-between'>
                    <Heading title={`Current high bid is`} />
                    <div className={`border-2 border-gray-700 text-white py-1 px-2 rounded-lg flex justify-center w-1/5 
    ${auction.currentHighBid >= auction.reservePrice
                            ? (highBidder === user?.username ? 'bg-green-500' : 'bg-red-500')
                            : 'bg-amber-500'}`}>
                        {numberWithCommas(highBid)} {highBidder}
                    </div>
                </div>
            </div>

            <div className='overflow-auto h-[245px] flex flex-col-reverse px-2 mb-2 bg-gray-500 rounded-lg'>
                {bids.length === 0 ? (
                    <EmptyFilter title='No bids for this item'
                        subtitle='Please feel free to make a bid' />
                ) : (
                    bids.map(bid => (
                        <BidItem key={bid.id} username={user?.username} bid={bid} />
                    ))
                )}
            </div>

            <div className='px-2 pb-2 text-gray-500'>
                {!open ? (
                    <div className='flex items-center justify-center p-2 text-lg font-semibold'>
                        This auction has finished
                    </div>
                ) : !user ? (
                    <div className='flex items-center justify-center p-2 text-lg font-semibold'>
                        Please login to make a bid
                    </div>
                ) : user.username === auction.seller ? (
                    <div className='flex items-center justify-center p-2 text-lg font-semibold'>
                        You cannot bid on your own auction
                    </div>
                ) : (
                    <BidForm auctionId={auction.id} highBid={highBid} />
                )}
            </div>
        </div>
    )
}
