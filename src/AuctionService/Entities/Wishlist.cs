namespace AuctionService.Entities
{
    public class WishlistItem
    {
        public string UserId { get; set; }
        public Guid AuctionId { get; set; }

        public Auction Auction { get; set; } 
    }

}
