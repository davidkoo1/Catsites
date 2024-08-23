using Application.Common.Interfaces;
using Application.Common.Security;
using AuctionService.Application.DTOs;
using AuctionService.Domain.Entities;
using AutoMapper;
using Contracts;
using MassTransit;
using MediatR;
using Microsoft.AspNetCore.Http;

namespace Application.Auctions.Commands.CreateAuction
{
    [Authorize]
    public record CreateAuctionCommand(CreateAuctionDTO CreateAuctionDto) : IRequest<Tuple<bool, AuctionDto>>;

    public class CreateAuctionCommandHandler : IRequestHandler<CreateAuctionCommand, Tuple<bool, AuctionDto>>
    {
        private readonly IAuctionDbContext _auctionDbContext;
        private readonly IMapper _mapper;
        private readonly IPublishEndpoint _publishEndpoint;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public CreateAuctionCommandHandler(IAuctionDbContext auctionDbContext, IMapper mapper, IPublishEndpoint publishEndpoint, IHttpContextAccessor httpContextAccessor)
        {
            _auctionDbContext = auctionDbContext;
            _mapper = mapper;
            _publishEndpoint = publishEndpoint;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<Tuple<bool, AuctionDto>> Handle(CreateAuctionCommand request, CancellationToken cancellationToken)
        {
            var auction = _mapper.Map<Auction>(request.CreateAuctionDto);

            auction.Seller = _httpContextAccessor.HttpContext?.User?.Identity?.Name;

            _auctionDbContext.Auctions.Add(auction);

            var newAuction = _mapper.Map<AuctionDto>(auction);

            await _publishEndpoint.Publish(_mapper.Map<AuctionCreated>(newAuction));

            var result = await _auctionDbContext.SaveChangesAsync(cancellationToken) > 0;

            return Tuple.Create(result, newAuction);
        }
    }

}
