'use client'

import { useParamsStore } from '@/hooks/useParamsStore';
import React from 'react'
import { AiFillCar } from 'react-icons/ai';

export default function Logo() {

    const reset = useParamsStore(state => state.reset);

    return (
        <div onClick={reset} className='cursor-pointer flex items-center gap-2 text-3xl font-bold'>
            <AiFillCar size={30} />
            <div>Carsities Auctions</div>
        </div>
    )
}
