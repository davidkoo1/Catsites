'use client'
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
      alt="image"
      fill
      className={`object-cover 
        group-hover:opacity-75 duration-700 ease-in-out 
        ${isLoading ? 'whitescale blur-sm scale-110' : 'whitescale-0 blur-0 scale-100'}`}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
      priority
      onLoad={() => setLoading(false)} 
    />
  )
}
