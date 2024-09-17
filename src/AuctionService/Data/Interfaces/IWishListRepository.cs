using AuctionService.DTOs;
using AuctionService.DTOs.WishlistPaginated;

namespace AuctionService.Data.Interfaces
{
    public interface IWishListRepository
    {
        Task<PaginatedList<AuctionDto>> GetPagiatedWishlistByUserIdAsync(string userId, SearchParams searchParams);
        Task<List<AuctionDto>> GetWishlistByUserIdAsync(string userId);
        Task<List<Guid>> GetWishlistGuidsByUserIdAsync(string userId);
        Task<bool> AddToWishlistAsync(string userId, Guid auctionId);
        Task<bool> RemoveFromWishlistAsync(string userId, Guid auctionId);
        Task<bool> SaveChangesAsync();
    }
}
