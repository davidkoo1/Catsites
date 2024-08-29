'use client';

import { usePathname } from 'next/navigation';
import React from 'react';

// Import both versions of the Search component
import SearchOnMainPage from './SearchOnMainPage';
import SearchOnOtherPages from './SearchOnOtherPages';

export default function ConditionalSearch() {
    const pathname = usePathname();

    if (pathname === '/') {
        return <SearchOnMainPage />;
    } else {
        return <SearchOnOtherPages />;
    }
}
