using Application.Common.Interfaces;
using Application.Common.Security;
using Contracts;
using MassTransit;
using MediatR;
using Microsoft.AspNetCore.Http;

namespace Application.Auctions.Commands.DeleteAuction
{
    [Authorize]
    public record DeleteAuctionCommand(Guid Id) : IRequest<bool>;

    public class DeleteAuctionCommandHandler : IRequestHandler<DeleteAuctionCommand, bool>
    {
        private readonly IAuctionDbContext _auctionDbContext;
        private readonly IPublishEndpoint _publishEndpoint;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public DeleteAuctionCommandHandler(IAuctionDbContext auctionDbContext, IPublishEndpoint publishEndpoint, IHttpContextAccessor httpContextAccessor)
        {
            _auctionDbContext = auctionDbContext;
            _publishEndpoint = publishEndpoint;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<bool> Handle(DeleteAuctionCommand request, CancellationToken cancellationToken)
        {
            var auction = await _auctionDbContext.Auctions.FindAsync(request.Id); ;

            if (auction.Seller != _httpContextAccessor.HttpContext?.User?.Identity?.Name)
                return false;

            _auctionDbContext.Auctions.Remove(auction);

            await _publishEndpoint.Publish<AuctionDeleted>(new { Id = auction.Id.ToString() });

            return await _auctionDbContext.SaveChangesAsync(cancellationToken) > 0;

        }
    }
}
