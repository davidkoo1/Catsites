using AuctionService.Application.DTOs;
using AuctionService.Domain.Entities;
using AutoMapper;

namespace Application.Common.RequestHelpers
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            CreateMap<Auction, AuctionDto>().IncludeMembers(x => x.Item);
            CreateMap<Item, AuctionDto>();
            CreateMap<CreateAuctionDTO, Auction>().ForMember(d => d.Item, o => o.MapFrom(s => s)); //s - Item
            CreateMap<CreateAuctionDTO, Item>();
            //CreateMap<AuctionDto, AuctionCreated>();
            //CreateMap<Auction, AuctionUpdated>().IncludeMembers(a => a.Item);
            //CreateMap<Item, AuctionUpdated>();
        }
    }
}
