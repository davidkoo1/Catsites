'use client'

import React, { useState } from 'react';
import Countdown, { zeroPad } from 'react-countdown';

type Props = {
  auctionEnd: string;
}

const renderer = ({ days, hours, minutes, seconds, completed }:
  { days: number, hours: number, minutes: number, seconds: number, completed: boolean }) => {

  return (
    <div className={`border-2 border-white text-white py-1 px-2 rounded-lg flex justify-center
            ${completed ? 'bg-red-600' : (days === 0 && hours < 10) ? 'bg-amber-600' : 'bg-green-500'}
            `}>
      {completed ? (
        <span>Auction finished</span>
      ) : (
        <span suppressHydrationWarning={true}>
          {zeroPad(days)}:{zeroPad(hours)}:{zeroPad(minutes)}:{zeroPad(seconds)}
        </span>
      )}
    </div>
  )
}

export default function CoutdownTimer({ auctionEnd }: Props) {
  const [showFormat, setShowFormat] = useState(false);

  const handleMouseEnter = () => {
    setShowFormat(true);
  };

  const handleMouseLeave = () => {
    setShowFormat(false);
  };

  return (
    <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} className="relative">
      {showFormat && (
        <div className="absolute top-[-30px] left-1/2 transform -translate-x-1/2 bg-black text-white text-sm px-2 py-1 rounded">
          DD:HH:MM:SS
        </div>
      )}
      <Countdown date={auctionEnd} renderer={renderer} />
    </div>
  )
}
