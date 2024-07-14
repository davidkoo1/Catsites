using Application.Common.Interfaces;
using AuctionService.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System.Reflection;

namespace AuctionService.Infrastructure.Persistance
{
    public class AuctionDbContext : DbContext, IAuctionDbContext
    {
        public AuctionDbContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<Auction> Auctions { get; set; }

        public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = new CancellationToken()) => await base.SaveChangesAsync(cancellationToken);

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
            base.OnModelCreating(modelBuilder);

            //modelBuilder.AddInboxStateEntity();
            //modelBuilder.AddOutboxMessageEntity();
            //modelBuilder.AddOutboxStateEntity();
        }
    }
}
