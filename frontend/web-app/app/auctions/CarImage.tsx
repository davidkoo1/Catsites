'use client'

import React, { useState } from 'react';

type Props = {
    imageUrl: string;
};

const DEFAULT_IMAGE_URL = 'https://avatars.mds.yandex.net/i?id=f4003c14b2c4f83353131d7aeece128e6a2b0cb9-9198174-images-thumbs&ref=rim&n=33&w=341&h=250';

export default function CarImage({ imageUrl }: Props) {
    const [src, setSrc] = useState(imageUrl);
    const [isLoading, setLoading] = useState(true);

    const handleError = () => {
        setSrc(DEFAULT_IMAGE_URL);
    };

    return (
        <img
            src={src}
            alt="Car Image"
            onLoad={() => setLoading(false)}
            onError={handleError}
            className={`object-cover transition-all group-hover:opacity-75 duration-700 ease-in-out ${isLoading ? 'grayscale blur-2xl scale-110' : 'grayscale-0 blur-0 scale-100'}`}
            style={{ width: '100%', height: '100%' }}
        />
    );
}
