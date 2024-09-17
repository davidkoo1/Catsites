using AuctionService.Data.Interfaces;
using AuctionService.DTOs;
using AuctionService.Entities;
using AutoMapper;
using Contracts;
using MassTransit;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AuctionService.Controllers;

[ApiController]
[Route("api/auctions")]
public class AuctionsController : ControllerBase
{
    private readonly IAuctionRepository _repo;
    private readonly IMapper _mapper;
    private readonly IPublishEndpoint _publishEndpoint;

    public AuctionsController(IAuctionRepository repo, IMapper mapper,
        IPublishEndpoint publishEndpoint)
    {
        _repo = repo;
        _mapper = mapper;
        _publishEndpoint = publishEndpoint;
    }

    [HttpGet]
    public async Task<ActionResult<List<AuctionDto>>> GetAllAuctions(string date)
    {
       return await _repo.GetAuctionsAsync(date);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<AuctionDto>> GetAuctionById(Guid id)
    {
        var auction = await _repo.GetAuctionByIdAsync(id);

        if (auction == null) return NotFound();

        if (User.Identity.IsAuthenticated)
        {
            var userId = User.GetUserId();

            auction.IsInWishlist = await _repo.IsAuctionInWishlist(userId, id);

        }

        return auction;
    }

    [Authorize]
    [HttpPost]
    public async Task<ActionResult<AuctionDto>> CreateAuction(CreateAuctionDto auctionDto)
    {
        var auction = _mapper.Map<Auction>(auctionDto);
        //const string defaultImagePath = "AuctionsItems/DefaultImg.png";
        //string defaultImageUrl = $"{Request.Scheme}://{Request.Host}/{defaultImagePath}";

        if (!auction.Item.ImageUrl.StartsWith("https", StringComparison.OrdinalIgnoreCase))
        {
            //auction.Item.ImageUrl = defaultImageUrl;
            auction.Item.ImageUrl = "https://avatars.mds.yandex.net/i?id=f4003c14b2c4f83353131d7aeece128e6a2b0cb9-9198174-images-thumbs&ref=rim&n=33&w=341&h=250";
        }

        auction.Seller = User.Identity.Name;

        _repo.AddAuction(auction);

        var newAuction = _mapper.Map<AuctionDto>(auction);

        await _publishEndpoint.Publish(_mapper.Map<AuctionCreated>(newAuction));

        var result = await _repo.SaveChangesAsync();

        if (!result) return BadRequest("Could not save changes to the DB");

        return CreatedAtAction(nameof(GetAuctionById),
            new { auction.Id }, newAuction);
    }

    [Authorize]
    [HttpPut("{id}")]
    public async Task<ActionResult> UpdateAuction(Guid id, UpdateAuctionDto updateAuctionDto)
    {
        var auction = await _repo.GetAuctionEntityById(id);

        if (auction == null) return NotFound();

        if (auction.Seller != User.Identity.Name) return Forbid();

        auction.Item.Make = updateAuctionDto.Make ?? auction.Item.Make;
        auction.Item.Model = updateAuctionDto.Model ?? auction.Item.Model;
        auction.Item.Color = updateAuctionDto.Color ?? auction.Item.Color;
        auction.Item.Mileage = updateAuctionDto.Mileage ?? auction.Item.Mileage;
        auction.Item.Year = updateAuctionDto.Year ?? auction.Item.Year;

        await _publishEndpoint.Publish(_mapper.Map<AuctionUpdated>(auction));

        var result = await _repo.SaveChangesAsync();

        if (result) return Ok();

        return BadRequest("Problem saving changes");
    }

    [Authorize]
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteAuction(Guid id)
    {
        var auction = await _repo.GetAuctionEntityById(id);

        if (auction == null) return NotFound();

        if (auction.Seller != User.Identity.Name) return Forbid();

        _repo.RemoveAuction(auction);

        await _publishEndpoint.Publish<AuctionDeleted>(new { Id = auction.Id.ToString() });

        var result = await _repo.SaveChangesAsync();

        if (!result) return BadRequest("Could not update DB");

        return Ok();
    }

    [HttpGet("export/{id}")]
    public async Task<FileResult> ExportAuctionToCsv(Guid id)
    {
        var csvData = await _repo.ExportAuctionToCsvAsync(id);

        return File(csvData, "text/csv", "auction.csv");
    }


}
