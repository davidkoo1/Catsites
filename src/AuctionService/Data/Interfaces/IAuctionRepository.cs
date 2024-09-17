using AuctionService.DTOs;
using AuctionService.Entities;

namespace AuctionService.Data.Interfaces;

public interface IAuctionRepository
{
    Task<List<AuctionDto>> GetAuctionsAsync(string date);
    Task<AuctionDto> GetAuctionByIdAsync(Guid id);
    Task<Auction> GetAuctionEntityById(Guid id);
    void AddAuction(Auction auction);
    void RemoveAuction(Auction auction);
    Task<byte[]> ExportAuctionToCsvAsync(Guid id);
    Task<bool> IsAuctionInWishlist(string userId, Guid auctionId);
    Task<bool> SaveChangesAsync();
}
