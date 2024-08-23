using Application.Common.Interfaces;
using AuctionService.Application.DTOs;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace Application.Auctions.Queries.GetAuctions
{
    //[Authorize]
    public record GetAuctionsQuery(string? date) : IRequest<List<AuctionDto>>;

    public class GetAuctionsQueryHandler : IRequestHandler<GetAuctionsQuery, List<AuctionDto>>
    {
        private readonly IAuctionRepository _auctionDbContext;
        private readonly IMapper _mapper;

        public GetAuctionsQueryHandler(IAuctionRepository auctionDbContext, IMapper mapper)
        {
            _auctionDbContext = auctionDbContext;
            _mapper = mapper;
        }

        public async Task<List<AuctionDto>> Handle(GetAuctionsQuery request, CancellationToken cancellationToken)
        {

            return await _auctionDbContext.GetAuctionsAsync(request.date);

        }
    }

}
