'use client';

import { useBidStore } from "@/hooks/useBidStore";
import { Auction } from "@/types";
import { useRouter } from "next/navigation";
import { FaCar, FaTag, FaClock, FaUser, FaPalette, FaTrophy, FaCalendarAlt, FaRoad } from 'react-icons/fa';

type Props = {
    auction: Auction;
};

export default function DetailedSpecs({ auction }: Props) {
    const open = useBidStore(state => state.open);
    const bids = useBidStore(state => state.bids);
    const router = useRouter();

    const highBid = bids.reduce((prev, current) => prev > current.amount
        ? prev
        : current.bidStatus.includes('Accepted')
            ? current.amount
            : prev, 0);


    const handleAllAuctionsClick = () => {
        router.push('/');
    };

    return (
        <div className="p-6 bg-white shadow-lg rounded-lg">
            {/* Header Section */}
            <div className="mb-6 border-b border-gray-200 pb-4 flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 cursor-pointer hover:underline">Auction Details</h2>
                    {/* <p className="text-gray-600 mt-1">Explore all the information about this auction.</p> */}
                </div>
                <div>
                    <button
                        onClick={handleAllAuctionsClick}
                        className="ml-4 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                    >
                        View All Auctions
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Car Information */}
                <div className="space-y-3">
                    <h3 className="text-xl font-bold text-gray-800">Car Information</h3>
                    <ul className="list-none text-base text-gray-700 space-y-2">
                        <li className="flex items-center">
                            <strong className="w-32 flex-shrink-0">Make:</strong>
                            <span className="flex-1 text-center">{auction.make}</span>
                        </li>
                        <li className="flex items-center">
                            <strong className="w-32 flex-shrink-0">Model:</strong>
                            <span className="flex-1 text-center">{auction.model}</span>
                        </li>
                        <li className="flex items-center">
                            <FaCalendarAlt className="text-green-500" />
                            <strong className="w-32 flex-shrink-0">Year:</strong>
                            <span className="flex-1 text-center">{auction.year}</span>
                        </li>
                        <li className="flex items-center">
                            <FaRoad className="text-gray-500" />
                            <strong className="w-32 flex-shrink-0">Mileage:</strong>
                            <span className="flex-1 text-center">{auction.mileage}</span>
                        </li>
                        <li className="flex items-center">
                            <FaPalette className="text-purple-500" />
                            <strong className="w-32 flex-shrink-0">Color:</strong>
                            <span className="flex-1 text-center">{auction.color}</span>
                        </li>
                    </ul>
                </div>

                {/* Auction Information */}
                <div className="space-y-3">
                    <h3 className="text-xl font-bold text-gray-800">Auction Information</h3>
                    <ul className="list-none text-base text-gray-700 space-y-2">
                        <li className="flex items-center">
                            <FaClock className="text-red-500" />
                            <strong className="w-32 flex-shrink-0">Auction End:</strong>
                            <span className="flex-1 text-center">{new Date(auction.auctionEnd).toLocaleString()}</span>
                        </li>
                        <li className="flex items-center">
                            <FaTag className="text-green-500" />
                            <strong className="w-32 flex-shrink-0">High Bid:</strong>
                            <span className="flex-1 text-center text-green-500">${highBid}</span>
                        </li>
                        <li className="flex items-center">
                            <strong className="w-32 flex-shrink-0">Reserve Price:</strong>
                            <span className="flex-1 text-center">{auction.reservePrice > 0 ? 'Yes' : 'No'}</span>
                        </li>
                        {!open && (
                            <>
                                <li className="flex items-center">
                                    <FaTrophy className="text-yellow-500" />
                                    <strong className="w-32 flex-shrink-0">Winner:</strong>
                                    <span className="flex-1 text-center">{auction.winner ? auction.winner : <span className="text-red-500">None</span>}</span>
                                </li>
                                <li className="flex items-center">
                                    <FaTag className={`text-${auction.status === 'sold' ? 'green' : 'yellow'}-500`} />
                                    <strong className="w-32 flex-shrink-0">Status:</strong>
                                    <span className="flex-1 text-center">{auction.status}</span>
                                </li>
                            </>
                        )}
                        <li className="flex items-center">
                            <strong className="w-32 flex-shrink-0">Created At:</strong>
                            <span className="flex-1 text-center">{new Date(auction.createdAt).toLocaleString()}</span>
                        </li>
                        {auction.lastUpdatedAt && (
                            <li className="flex items-center">
                                <strong className="w-32 flex-shrink-0">Last Updated:</strong>
                                <span className="flex-1 text-center">{new Date(auction.lastUpdatedAt).toLocaleString()}</span>
                            </li>
                        )}
                    </ul>
                </div>

                {/* Seller Information */}
                <div className="space-y-3">
                    <h3 className="text-xl font-bold text-gray-800">Seller Information</h3>
                    <ul className="list-none text-base text-gray-700 space-y-2">
                        <li className="flex items-center">
                            <FaUser className="text-blue-500" />
                            <strong className="w-32 flex-shrink-0">Seller:</strong>
                            <span className="flex-1 text-center">{auction.seller}</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
