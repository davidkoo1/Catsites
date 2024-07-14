using Application.Common.Interfaces;
using AuctionService.Application.DTOs;
using AutoMapper;
using Contracts;
using MassTransit;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace Application.Auctions.Commands.UpdateAuction
{
    //[Authorize]
    public record UpdateAuctionCommand(Guid Id, UpdateAuctionDto UpdateAuctionDto) : IRequest<bool>;

    public class UpdateAuctionCommandHandler : IRequestHandler<UpdateAuctionCommand, bool>
    {
        private readonly IAuctionDbContext _auctionDbContext;
        private readonly IMapper _mapper;
        private readonly IPublishEndpoint _publishEndpoint;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public UpdateAuctionCommandHandler(IAuctionDbContext auctionDbContext, IMapper mapper, IPublishEndpoint publishEndpoint, IHttpContextAccessor httpContextAccessor)
        {
            _auctionDbContext = auctionDbContext;
            _mapper = mapper;
            _publishEndpoint = publishEndpoint;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<bool> Handle(UpdateAuctionCommand request, CancellationToken cancellationToken)
        {
            var auction = await _auctionDbContext.Auctions.Include(x => x.Item).FirstOrDefaultAsync(x => x.Id.Equals(request.Id));

            if (auction.Seller != _httpContextAccessor.HttpContext?.User?.Identity?.Name)
                return false;

            auction.Item.Make = request.UpdateAuctionDto.Make ?? auction.Item.Make;
            auction.Item.Model = request.UpdateAuctionDto.Model ?? auction.Item.Model;
            auction.Item.Color = request.UpdateAuctionDto.Color ?? auction.Item.Color;
            auction.Item.Mileage = request.UpdateAuctionDto.Mileage ?? auction.Item.Mileage;
            auction.Item.Year = request.UpdateAuctionDto.Year ?? auction.Item.Year;

            await _publishEndpoint.Publish(_mapper.Map<AuctionUpdated>(auction));

            return await _auctionDbContext.SaveChangesAsync(cancellationToken) > 0;

        }
    }
}
