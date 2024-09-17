import { useEffect, useState } from "react";
import { FaHeart, FaHeartBroken } from 'react-icons/fa';
import { toast } from "react-hot-toast";
import { useWishlistStore } from "@/hooks/useWishlistStore";
import { Auction } from "@/types";

type WishlistButtonProps = {
    auction: Auction;
};

const WishlistButton = ({ auction }: WishlistButtonProps) => {
    const { wishlist, addToWishlist, removeFromWishlist } = useWishlistStore();
    const [loading, setLoading] = useState(false);
    const [isInWishlist, setIsInWishlist] = useState(auction.isInWishlist); // Start with auction's initial state

    useEffect(() => {
        // Sync Zustand's state with auction's initial `isInWishlist` if needed
        if (auction.isInWishlist && !wishlist.includes(auction.id)) {
            setIsInWishlist(true);
        } else if (!auction.isInWishlist && wishlist.includes(auction.id)) {
            setIsInWishlist(true);
        }
    }, [auction.isInWishlist, wishlist, auction.id]);

    const handleWishlistToggle = async () => {
        setLoading(true);

        try {
            if (isInWishlist) {
                // Remove from wishlist
                await removeFromWishlist(auction.id);
                setIsInWishlist(false);
                toast.success('Removed from wishlist');
            } else {
                // Add to wishlist
                await addToWishlist(auction.id);
                setIsInWishlist(true);
                toast.success('Added to wishlist');
            }
        } catch (error) {
            toast.error('Error updating wishlist');
        }

        setLoading(false);
    };

    return (
            <button
                onClick={handleWishlistToggle}
                className={`ml-4 px-3 py-3 text-white rounded-lg flex items-center cursor-pointer
                 ${isInWishlist ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-500 hover:bg-gray-600'}`}
                disabled={loading}
            >
                {loading ? 'opacity-50 cursor-not-allowed' : (
                    isInWishlist
                        ? <FaHeart />
                        : <FaHeartBroken />
                )}
            </button>
    );
};

export default WishlistButton;
