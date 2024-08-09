'use client'

import { Pagination } from 'flowbite-react'
import React, { useState } from 'react'
import 'flowbite/dist/flowbite.css';
type Props = {
    currentPage: number
    pageCount: number
    pageChanged: (page: number) => void;
}

export default function AppPagination({currentPage, pageCount, pageChanged}: Props) {

    return (
        <Pagination 
            currentPage={currentPage}
            onPageChange={e => pageChanged(e)}
            totalPages={pageCount}
            layout='pagination'
            showIcons={true}
            className='flex justify-center items-center text-blue-500 mb-5 flex-row space-x-2'
        />
    )
}