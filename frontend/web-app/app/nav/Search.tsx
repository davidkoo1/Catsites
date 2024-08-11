'use client'

import { useParamsStore } from '@/hooks/useParamsStore'
import React, { useState } from 'react'
import { FaSearch } from 'react-icons/fa'

export default function Search() {

    const setParams = useParamsStore(state => state.setParams);
    const setSearchValue = useParamsStore(state => state.setSearchValue);
    const searchValue = useParamsStore(state => state.searchValue);
    const reset = useParamsStore(state => state.reset);


    function onChange(event: any) {
        setSearchValue(event.target.value);
    }

    function search() {
        setParams({ searchTerm: searchValue });
    }

    return (
        <div className='flex w-[50%] items-center border-2 rounded-full py-2 shadow-sm'>
            <input
                onKeyDown={(e: any) => {
                    if (e.key === 'Enter') search();
                }}
                onInput={(e) => {
                    // Проверяем, если поле стало пустым, значит был нажат крестик
                    if (e.target.value === '') {
                        reset(); // Вызываем функцию reset, если поле очищено
                    }
                }}
                value={searchValue}
                onChange={onChange}
                type="search"
                placeholder='Search for cars by make, model or color'
                className="
                w-full 
                form-input 
                rounded-xl
                text-black 
                p-2
                text-center
                items-center
                mx-2
                focus:outline-none
                focus:ring-0
                text-sm 
        " />
            <button onClick={search}>
                <FaSearch size={34}
                    className='bg-red-500 text-white rounded-full p-2 cursor-pointer mx-2' />
            </button>
        </div>
    )
}
/*
<div>
        <input type="search" placeholder="Search..." className="w-80 form-input rounded-xl text-black p-2" />
      </div>
*/
