'use client';

import { useBidStore } from "@/hooks/useBidStore";
import { Auction } from "@/types";
import { Dropdown, DropdownItem } from "flowbite-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FaTag, FaClock, FaUser, FaPalette, FaTrophy, FaCalendarAlt, FaRoad, FaCopy, FaEnvelope, FaFileCsv, FaShareAlt, FaPrint, FaHeart, FaHeartBroken, FaArrowRight } from 'react-icons/fa';
import AuctionToCvs from "./AuctionToCvs";
import WishlistButton from "./WishlistButton";
import { User } from "next-auth";



type Props = {
    auction: Auction;
    user: User;
};

export default function DetailedSpecs({ auction, user }: Props) {
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

    const handleCopyLink = () => {
        toast.success('Link copied to clipboard!');
        navigator.clipboard.writeText(window.location.href);
    };


    const handleSendEmail = () => {
        window.location.href = `mailto:?subject=Check this auction&body=Check out this auction: ${window.location.href}`;
    };

    return (
        <div className="p-6 bg-white shadow-lg rounded-lg">
            {/* Header Section */}
            <div className="mb-6 border-b border-gray-200 pb-4 flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Auction Details</h2>
                </div>

                <div className="flex items-center">
                    {/* Wishlist Button */}
                    {user?.username && (
                        <WishlistButton auction={auction} />
                    )}


                    {/* Share Dropdown */}
                    <div className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        <Dropdown label={<div className="flex items-center"><FaShareAlt className="mr-2" />Share</div>} inline>
                            <DropdownItem icon={FaCopy} onClick={handleCopyLink}>
                                Copy Link
                            </DropdownItem>
                            <AuctionToCvs auctionId={auction.id} />
                            <DropdownItem icon={FaEnvelope} onClick={handleSendEmail}>
                                Send via Email
                            </DropdownItem>
                            <DropdownItem icon={FaPrint} onClick={() => window.print()}>
                                Print
                            </DropdownItem>
                        </Dropdown>
                    </div>

                    <button
                        onClick={handleAllAuctionsClick}
                        className="ml-4 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center"
                    >
                        View All Auctions
                        <FaArrowRight className="ml-2" />
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
