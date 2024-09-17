using AuctionService.Entities;
using MassTransit;
using Microsoft.EntityFrameworkCore;

namespace AuctionService.Data;

public class AuctionDbContext : DbContext
{
    public AuctionDbContext(DbContextOptions options) : base(options)
    {
    }

    public DbSet<Auction> Auctions { get; set; }
    public DbSet<WishlistItem> Wishlists { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<WishlistItem>()
        .HasKey(w => new { w.UserId, w.AuctionId }); // Композитный ключ

        modelBuilder.Entity<WishlistItem>()
        .HasOne(w => w.Auction)
        .WithMany()
        .HasForeignKey(w => w.AuctionId);

        base.OnModelCreating(modelBuilder);

        modelBuilder.AddInboxStateEntity();
        modelBuilder.AddOutboxMessageEntity();
        modelBuilder.AddOutboxStateEntity();
    }
}
