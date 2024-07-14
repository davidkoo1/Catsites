using AuctionService.Domain.Common;
using System.ComponentModel.DataAnnotations.Schema;

namespace AuctionService.Domain.Entities;

[Table("Items")]
public class Item : Entity<Guid>
{
    public string Make { get; set; }
    public string Model { get; set; }
    public int Year { get; set; }
    public string Color { get; set; }
    public int Mileage { get; set; }
    public string ImageUrl { get; set; }


    public Auction Auction { get; set; }
    public Guid AuctionId { get; set; }

}
