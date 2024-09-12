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
import { FaSpinner } from 'react-icons/fa';
import { useAuctionStore } from '@/hooks/useAuctionStore';

type Props = {
    currentAuctionId: string
    make: string
}

export default function SimilarAuctions({ currentAuctionId, make }: Props) {
    const [loading, setLoading] = useState(true)
    const params = useParamsStore(useShallow(state => ({
        pageNumber: state.pageNumber,
        pageSize: 4,
        searchTerm: make,
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

    function setPageNumber(pageNumber: number) {
        setParams({ pageNumber })
    }

    useEffect(() => {
        getData(url).then(data => {
            setData(data);
            setLoading(false);
        })
    }, [url])

    if (loading) return (
        <div className="flex justify-center items-center">
            <FaSpinner className="animate-spin text-4xl text-blue-500" />
        </div>
    );

    return (
        <>
            <Filters />
            {data.totalCount === 0 || data.totalCount === 1 ? (
                <EmptyFilter showReset />
            ) : (
                <>
                    <div className='grid grid-cols-4 gap-6'>
                        {data.auctions
                            .filter(auction => auction.id !== currentAuctionId)
                            .map(auction => (
                                <AuctionCard auction={auction} key={auction.id} />
                            ))
                        }
                    </div>
                    {data.pageCount > 1 && (
                        <div className='flex justify-center mt-4'>
                            <AppPagination pageChanged={setPageNumber} currentPage={params.pageNumber} pageCount={data.pageCount} />
                        </div>
                    )}
                </>

            )}
        </>
    )
}
