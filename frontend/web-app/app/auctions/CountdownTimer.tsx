'use client'

import { useBidStore } from '@/hooks/useBidStore';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react'
import Countdown, { zeroPad } from 'react-countdown';

type Props = {
  auctionEnd: string;
}

const renderer = ({ days, hours, minutes, seconds, completed }:
  { days: number, hours: number, minutes: number, seconds: number, completed: boolean }) => {
  return (
    <div className={`
                border-2 
                border-white 
                text-white py-1 px-2 
                rounded-lg flex justify-center
                ${completed ?
        'bg-red-600' : (days === 0 && hours < 10)
          ? 'bg-amber-600' : 'bg-green-600'}
            `}>
      {completed ? (
        <span>Auction finished</span>
      ) : (
        <span suppressHydrationWarning={true}>
          {zeroPad(days)}:{zeroPad(hours)}:{zeroPad(minutes)}:{zeroPad(seconds)}
        </span>
      )}
    </div>
  );
};

export default function CountdownTimer({ auctionEnd }: Props) {
  const setOpen = useBidStore(state => state.setOpen);
  const pathname = usePathname();
  const [showFormat, setShowFormat] = useState(false);

  const handleMouseEnter = () => {
    setShowFormat(true);
  };

  const handleMouseLeave = () => {
    setShowFormat(false);
  };

  function auctionFinished() {
    if (pathname.startsWith('/auctions/details')) {
      setOpen(false);
    }
  }

  return (
    <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} className="relative">
      {/* Показываем формат только если аукцион не завершён */}
      {!auctionEnd || Date.now() < new Date(auctionEnd).getTime() ? (
        showFormat && (
          <div className="absolute top-[-30px] left-1/2 transform -translate-x-1/2 bg-black text-white text-sm px-2 py-1 rounded">
            DD:HH:MM:SS
          </div>
        )
      ) : null}
      <Countdown date={auctionEnd} renderer={renderer} onComplete={auctionFinished} />
    </div>
  );
}
