'use client'

type Props = {
    auctionId: string;
    highBid: number;
}

import { placeBidForAuction } from '@/app/actions/auctionActions';
import { numberWithCommas } from '@/app/lib/numberWithComma';
import { useBidStore } from '@/hooks/useBidStore';
import React from 'react'
import { FieldValues, useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';

export default function BidForm({ auctionId, highBid }: Props) {
    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();
    const addBid = useBidStore(state => state.addBid);

    function onSubmit(data: FieldValues) {
        if (data.amount <= highBid) {
            reset();
            return toast.error('Bid must be at least $' + numberWithCommas(highBid + 1));
        }

        placeBidForAuction(auctionId, +data.amount).then(bid => {
            if (bid.error) throw bid.error;
            addBid(bid);
            reset();
        }).catch(err => toast.error(err.message));
    }

    function handlePercentageBid(percentage: number) {
        /*if 0, 
        or currentbid*percetage <= highBid 
        or while > 10$ 5% = +5$ */
        const bidAmount = Math.round(highBid + (highBid * percentage));
        setValue('amount', bidAmount);
        handleSubmit(onSubmit)();
    }

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)} className='flex items-center py-2'>
                <input
                    type="number"
                    {...register('amount')}
                    className='input-custom text-sm'
                    placeholder={`Enter your bid (minimum bid is $${numberWithCommas(highBid + 1)})`}
                />
            </form>

            <div className="flex w-full">
                <button
                    className="border border-white bg-amber-500 text-white p-1 rounded text-xl font-bold w-1/3"
                    onClick={() => handlePercentageBid(0.05)}
                >
                    ~5%
                </button>
                <button
                    className="border border-white bg-amber-500 text-white p-1 rounded text-xl font-bold w-1/3"
                    onClick={() => handlePercentageBid(0.1)}
                >
                    ~10%
                </button>
                <button
                    className="border border-white bg-amber-500 text-white p-1 rounded text-xl font-bold w-1/3"
                    onClick={() => handlePercentageBid(0.15)}
                >
                    ~15%
                </button>
            </div>

            <div className="flex w-full">
                <button
                    className="border border-white bg-green-500 text-white p-1 rounded text-xl font-bold w-1/3"
                    onClick={() => handlePercentageBid(0.05)}
                >
                    +100$
                </button>
                <button
                    className="border border-white bg-green-500 text-white p-1 rounded text-xl font-bold w-1/3"
                    onClick={() => handlePercentageBid(0.1)}
                >
                    +500$
                </button>
                <button
                    className="border border-white bg-green-500 text-white p-1 rounded text-xl font-bold w-1/3"
                    onClick={() => handlePercentageBid(0.15)}
                >
                    +1000$
                </button>
            </div>
        </div>
    )
}
