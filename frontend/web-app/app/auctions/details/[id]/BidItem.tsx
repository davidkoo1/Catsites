import { numberWithCommas } from '@/app/lib/numberWithComma';
import { Bid } from '@/types'
import { format } from 'date-fns';
import { User } from 'next-auth';
import React from 'react'

type Props = {
    username?: string
    bid: Bid
}

export default function BidItem({ username, bid }: Props) {
    function getBidInfo() {
        let bgColor = '';
        let text = '';
        switch (bid.bidStatus) {
            case 'Accepted':
                bgColor = bid.bidder !== username ? 'bg-green-200' : 'bg-green-400'
                text = 'Bid accepted'
                break;
            case 'AcceptedBelowReserve':
                bgColor = bid.bidder !== username ? 'bg-amber-500' : 'bg-amber-400'
                text = 'Reserve not met'
                break;
            case 'TooLow':
                bgColor = bid.bidder !== username ? 'bg-red-200' : 'bg-red-400'
                text = 'Bid was too low'
                break;
            default:
                bgColor = 'bg-red-200'
                text = 'Bid placed after auction finished'
                break;
        }
        return {bgColor, text}
    }

    return (
        <div className={`
            border-gray-300 border-2 px-3 py-2 rounded-lg
            flex justify-between items-center mb-2 text-black
            ${getBidInfo().bgColor}
        `}>
            <div className='flex flex-col'>
               <span>Bidder: {bid.bidder}</span>
                <span className='text-gray-700 text-sm'>
                    Time: {format(new Date(bid.bidTime), 'dd MMM yyyy h:mm:ss a')}
                </span>
            </div>
            <div className='flex flex-col text-right'>
                <div className='text-xl font-semibold'>${numberWithCommas(bid.amount)}</div>
                <div className='flex flex-row items-center'>
                    <span>{getBidInfo().text}</span>
                </div>
            </div>
        </div>
    )
}