using AuctionService.Data;
using AuctionService.DTOs;
using AuctionService.Entities;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AuctionService.Controllers
{
    [ApiController]
    [Route("api/auctions")]
    public class AuctionController : Controller
    {
        private readonly AuctionDbContext _auctionDbContext;
        private readonly IMapper _mapper;

        public AuctionController(AuctionDbContext auctionDbContext, IMapper mapper)
        {
            _auctionDbContext = auctionDbContext;
            _mapper = mapper;
        }




        [HttpGet]
        public async Task<ActionResult<List<AuctionDto>>> GetAllAuctions()
        {
            var auctions = await _auctionDbContext.Auctions.Include(x => x.Item).OrderBy(x => x.Item.Make).ToListAsync();

            return _mapper.Map<List<AuctionDto>>(auctions);
        }


        [HttpGet("{id}")]
        public async Task<ActionResult<AuctionDto>> GetAuctionById(Guid id)
        {
            var auction = await _auctionDbContext.Auctions
                .Include(x => x.Item)
                .FirstOrDefaultAsync(x => x.Id == id);

            return auction is null ? NotFound() : _mapper.Map<AuctionDto>(auction);

        }

        [HttpPost]
        public async Task<ActionResult<AuctionDto>> CreateAuction(CreateAuctionDTO createAuctionDto)
        {
            var auction = _mapper.Map<Auction>(createAuctionDto);

            auction.Seller = "test";

            _auctionDbContext.Auctions.Add(auction);

            var result = await _auctionDbContext.SaveChangesAsync() > 0;

            if (!result) return BadRequest("Could not save changes to the DB");

            return CreatedAtAction(nameof(GetAuctionById), 
                new {auction.Id}, _mapper.Map<AuctionDto>(auction));

        }


        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateAuction(Guid id, UpdateAuctionDto updateAuctionDto)
        {
            var auction = await _auctionDbContext.Auctions.Include(x => x.Item).FirstOrDefaultAsync(x => x.Id.Equals(id));

            if(auction is null) return NotFound();


            auction.Item.Make = updateAuctionDto.Make ?? auction.Item.Make;
            auction.Item.Model = updateAuctionDto.Model ?? auction.Item.Model;
            auction.Item.Color = updateAuctionDto.Color ?? auction.Item.Color;
            auction.Item.Mileage = updateAuctionDto.Mileage ?? auction.Item.Mileage;
            auction.Item.Year = updateAuctionDto.Year ?? auction.Item.Year;


            var result = await _auctionDbContext.SaveChangesAsync() > 0;

            if (result) return Ok();

            return BadRequest("Problem saving changes");

        }


        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteAuction(Guid id)
        {
            var auction = await _auctionDbContext.Auctions.FindAsync(id);

            if (auction is null) return NotFound();

            _auctionDbContext.Auctions.Remove(auction);

            var result = await _auctionDbContext.SaveChangesAsync() > 0;

            if (!result) return BadRequest("Could not update DB");


            return Ok();

        }

    }
}
