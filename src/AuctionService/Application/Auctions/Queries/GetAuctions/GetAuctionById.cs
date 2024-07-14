using Application.Common.Interfaces;
using AuctionService.Application.DTOs;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Auctions.Queries.GetAuctions
{
    public record GetAuctionQuery(Guid id) : IRequest<AuctionDto>;

    public class GetAuctionQueryHandler : IRequestHandler<GetAuctionQuery, AuctionDto>
    {
        private readonly IAuctionDbContext _auctionDbContext;
        private readonly IMapper _mapper;

        public GetAuctionQueryHandler(IAuctionDbContext auctionDbContext, IMapper mapper)
        {
            _auctionDbContext = auctionDbContext;
            _mapper = mapper;
        }

        public async Task<AuctionDto> Handle(GetAuctionQuery request, CancellationToken cancellationToken)
        {
            var query = await _auctionDbContext.Auctions.Include(x => x.Item).FirstOrDefaultAsync(x => x.Id == request.id);

            if (query is null)
            {
                return default(AuctionDto); //null
            }

            return _mapper.Map<AuctionDto>(query);

        }
    }
}
