/*'use client'

import React, { useState } from 'react'
import Image from 'next/image'

type Props = {
    imageUrl: string
}

export default function CarImage({imageUrl}: Props) {
    const [isLoading, setLoading] = useState(true);
    return (
        <Image
            src={imageUrl}
            alt='Car Image'
            fill
            priority
            className={`
                object-cover
                transition-all
                group-hover:opacity-75
                duration-700
                ease-in-out
                ${isLoading ? 'grayscale blur-2xl scale-110' : 'grayscale-0 blur-0 scale-100'}
            `}
            sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
            onLoadingComplete={() => setLoading(false)}
        />
    )
}

*/


'use client'

import React, { useState } from 'react';

type Props = {
    imageUrl: string;
};

export default function CarImage({ imageUrl }: Props) {
    const [isLoading, setLoading] = useState(true);

    return (
        <img
            src={imageUrl}
            alt="Car Image"
            onLoad={() => setLoading(false)}
            className={`
                object-cover
                transition-all
                group-hover:opacity-75
                duration-700
                ease-in-out
                ${isLoading ? 'grayscale blur-2xl scale-110' : 'grayscale-0 blur-0 scale-100'}
            `}
            style={{ width: '100%', height: '100%' }} // Аналог fill из next/image
        />
    );
}

