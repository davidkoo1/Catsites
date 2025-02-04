import { create } from "zustand";

type State = {
    pageNumber: number
    pageSize: number
    pageCount: number
    searchTerm: string
    searchValue: string
    orderBy: string
    filterBy: string
    seller?: string
    winner?: string,
    isInWishlist: boolean
};

type Auctions = {
    setParams: (params: Partial<State>) => void;
    reset: () => void;
    setSearchValue: (value: string) => void;
    resetSearchTerm: () => void;
};

const initialState: State = {
    pageNumber: 1,
    pageSize: 16,
    pageCount: 1,
    searchTerm: '',
    searchValue: '',
    orderBy: 'make',
    filterBy: 'live',
    seller: undefined,
    winner: undefined,
    isInWishlist: false
};

export const useParamsStore = create<State & Auctions>()((set) => ({
    ...initialState,

    setParams: (newParams: Partial<State>) => {
        set((state) => {
            if (newParams.pageNumber) {
                return { ...state, pageNumber: newParams.pageNumber };
            } else {
                return { ...state, ...newParams, pageNumber: 1 };
            }
        });
    },

    reset: () => set(initialState),

    setSearchValue: (value: string) => {
        set({ searchValue: value });
    },

    resetSearchTerm: () => {
        set((state) => ({ ...state, searchTerm: '' }));
    }
}));
