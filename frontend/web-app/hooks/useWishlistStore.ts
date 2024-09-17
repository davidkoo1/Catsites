import { addToWishlist, removeFromWishlist } from '@/app/actions/auctionActions';
import { create } from 'zustand';

type WishlistState = {
    wishlist: string[]; // Array of auction IDs in the wishlist
    addToWishlist: (auctionId: string) => Promise<void>;
    removeFromWishlist: (auctionId: string) => Promise<void>;
};

export const useWishlistStore = create<WishlistState>((set) => ({
    wishlist: [],
    addToWishlist: async (auctionId: string) => {
        await addToWishlist(auctionId);
        set((state) => ({
            wishlist: [...state.wishlist, auctionId],
        }));
    },
    removeFromWishlist: async (auctionId: string) => {
        await removeFromWishlist(auctionId);
        set((state) => ({
            wishlist: state.wishlist.filter((id) => id !== auctionId),
        }));
    },
}));
