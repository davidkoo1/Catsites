import { useParamsStore } from '@/hooks/useParamsStore';
import React, { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';

export default function SearchOnMainPage() {
    const setParams = useParamsStore(state => state.setParams);
    const setSearchValue = useParamsStore(state => state.setSearchValue);
    const searchValue = useParamsStore(state => state.searchValue);
    const resetSearchTerm = useParamsStore(state => state.resetSearchTerm);

    const [debouncedValue, setDebouncedValue] = useState(searchValue);

    useEffect(() => {
        const handler = setTimeout(() => {
            setParams({ searchTerm: debouncedValue });
        }, 300);

        return () => {
            clearTimeout(handler);
        };
    }, [debouncedValue, setParams]);

    function onChange(event: React.ChangeEvent<HTMLInputElement>) {
        const value = event.target.value;
        setSearchValue(value);
        setDebouncedValue(value);
    }

    return (
        <div className='flex w-[50%] items-center border-2 rounded-full py-2 shadow-sm'>
            <input
                onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                    if (e.target.value === '') {
                        resetSearchTerm(); // Сброс только поискового запроса
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
                " 
            />
            <button onClick={() => setParams({ searchTerm: debouncedValue })}>
                <FaSearch size={34}
                    className='bg-red-500 text-white rounded-full p-2 cursor-pointer mx-2' />
            </button>
        </div>
    );
}
