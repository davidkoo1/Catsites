using AuctionService.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Application.Common.Interfaces
{
    public interface IAuctionDbContext
    {
        public DbSet<Auction> Auctions { get; set; }

        Task<int> SaveChangesAsync(CancellationToken cancellationToken);
    }
}
