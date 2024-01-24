using AuctionService.Data;
using Contracts;
using MassTransit;

namespace AuctionService.Consumers
{
    public class BidPlaceConsumer : IConsumer<BidPlaced>
    {
        private readonly AuctionDbContext _auctionDbContext;

        public BidPlaceConsumer(AuctionDbContext auctionDbContext)
        {
            _auctionDbContext = auctionDbContext;
        }
        public async Task Consume(ConsumeContext<BidPlaced> context)
        {

            Console.WriteLine("--> Consuming bid placed");

            var auction = await _auctionDbContext.Auctions.FindAsync(context.Message.AuctionId);

            if (auction.CurrentHighBid == null || context.Message.BidStatus.Contains("Accepted") && context.Message.Amount > auction.CurrentHighBid)
            {
                auction.CurrentHighBid = context.Message.Amount;
                await _auctionDbContext.SaveChangesAsync();
            }

        }
    }
}
