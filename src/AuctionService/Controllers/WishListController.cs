using AuctionService;
using AuctionService.Data.Interfaces;
using AuctionService.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

[ApiController]
[Route("api/wishlist")]
[Authorize]
public class WishListController : ControllerBase
{
    private readonly IWishListRepository _repo;

    public WishListController(IWishListRepository repo)
    {
        _repo = repo;
    }


    [HttpPost("add/{auctionId}")]
    public async Task<IActionResult> AddToWishlist(Guid auctionId)
    {
        var userId = User.GetUserId();
        var result = await _repo.AddToWishlistAsync(userId, auctionId);

        if (result)
        {
            return Ok(new { Message = "Item added to wishlist successfully." });
        }
        else
        {
            return Conflict(new { Message = "Item already exists in wishlist." });
        }
    }

    [HttpDelete("remove/{auctionId}")]
    public async Task<IActionResult> RemoveFromWishlist(Guid auctionId)
    {
        var userId = User.GetUserId();
        var result = await _repo.RemoveFromWishlistAsync(userId, auctionId);

        if (result)
        {
            return Ok(new { Message = "Item removed from wishlist successfully." });
        }
        else
        {
            return NotFound(new { Message = "Item not found in wishlist." });
        }
    }

    [HttpGet]
    public async Task<IActionResult> GetWishlist(/*[FromQuery] SearchParams searchParams*/)
    {
        if (User.Identity.IsAuthenticated)
        {
            var userId = User.GetUserId();

            //var paginatedWishlist = await _repo.GetPagiatedWishlistByUserIdAsync(userId, searchParams);

            //var response = new PaginatedResponse<AuctionDto>
            //{
            //    Results = paginatedWishlist.Items, 
            //    PageCount = (int)Math.Ceiling((double)paginatedWishlist.TotalCount / searchParams.PageSize), 
            //    TotalCount = paginatedWishlist.TotalCount
            //};

            //return Ok(response);

            var auctionIds = await _repo.GetWishlistGuidsByUserIdAsync(userId);
            return Ok(auctionIds);
        }
        return Ok(new List<Guid>());
    }


}
