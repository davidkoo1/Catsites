using Application.Common.Interfaces;
using AuctionService.Application.DTOs;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Auctions.Queries.GetAuctions
{
    //[Authorize]
    public record GetAuctionsQuery(string? date) : IRequest<List<AuctionDto>>;

    public class GetAuctionsQueryHandler : IRequestHandler<GetAuctionsQuery, List<AuctionDto>>
    {
        private readonly IAuctionDbContext _auctionDbContext;
        private readonly IMapper _mapper;

        public GetAuctionsQueryHandler(IAuctionDbContext auctionDbContext, IMapper mapper)
        {
            _auctionDbContext = auctionDbContext;
            _mapper = mapper;
        }

        public async Task<List<AuctionDto>> Handle(GetAuctionsQuery request, CancellationToken cancellationToken)
        {
            var query = _auctionDbContext.Auctions.OrderBy(x => x.Item.Make).AsQueryable();

            if (!string.IsNullOrEmpty(request.date))
                query = query.Where(x => x.LastUpdatedAt.CompareTo(DateTime.Parse(request.date).ToUniversalTime()) > 0);

            return await query.ProjectTo<AuctionDto>(_mapper.ConfigurationProvider).ToListAsync(cancellationToken);

        }
    }

}
