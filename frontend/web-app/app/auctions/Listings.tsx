'use client'
import React, { useEffect, useState } from 'react'
import AuctionCard from './AuctionCard';
import { Auction, PagedResult } from '@/types';
import AppPagination from '../components/AppPagination';
import { getData } from '../actions/auctionActions';
import Filters from './Filters';
import { useParamsStore } from '@/hooks/useParamsStore';
import { useShallow } from 'zustand/react/shallow';
import qs from 'query-string'
import EmptyFilter from '../components/EmptyFilter';
import Link from 'next/link';
import { AiOutlinePlusCircle } from 'react-icons/ai';
import { User } from 'next-auth'
import { useAuctionStore } from '@/hooks/useAuctionStore';

type Props = {
    user: User
}

export default function Listings({ user }: Props) {
    const [loading, setLoading] = useState(true)
    const params = useParamsStore(useShallow(state => ({
        pageNumber: state.pageNumber,
        pageSize: state.pageSize,
        searchTerm: state.searchTerm,
        orderBy: state.orderBy,
        filterBy: state.filterBy,
        seller: state.seller,
        winner: state.winner
    })));

    const data = useAuctionStore(useShallow(state => ({
        auctions: state.auctions,
        totalCount: state.totalCount,
        pageCount: state.pageCount
    })))
    const setData = useAuctionStore(state => state.setData)

    const setParams = useParamsStore(state => state.setParams);
    const url = qs.stringifyUrl({ url: '', query: params })

    // Assuming you have a way to get the current user's username
    const currentUsername = user?.username; // Replace with the actual logic to get the current user's username

    function setPageNumber(pageNumber: number) {
        setParams({ pageNumber })
    }

    useEffect(() => {
        getData(url).then(data => {
            setData(data);
            setLoading(false);
        })
    }, [url])

    if (loading) return <div>Loading...</div>

    return (
        <>
            <Filters />
            {data.totalCount === 0 ? (
                <EmptyFilter showReset />
            ) : (
                <>
                    <div className='grid grid-cols-4 gap-6'>
                        {params.seller && currentUsername && params.seller === currentUsername && (
                            <Link href='/auctions/create' className='flex flex-col items-center justify-center text-center text-gray-100 h-full w-full'>
                                <span className='mb-2'>My Auction</span>
                                <div className='flex items-center justify-center'>
                                    <AiOutlinePlusCircle size={50} />
                                </div>
                                <span className='mt-2'>Add New Auction</span>
                            </Link>
                        )}
                        {data.auctions.map(auction => (
                            <AuctionCard auction={auction} key={auction.id} />
                        ))}
                    </div>

                    <div className='flex justify-center mt-4'>
                        <AppPagination pageChanged={setPageNumber} currentPage={params.pageNumber} pageCount={data.pageCount} />
                    </div>
                </>

            )}
        </>
    )
}
