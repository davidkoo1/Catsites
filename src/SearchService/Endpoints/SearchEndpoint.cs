using MediatR;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Entities;
using SearchService.Infrastructure;
using SearchService.Models;

namespace SearchService.Endpoints
{
    public class SearchEndpoint : EndpointGroupBase
    {
        public record SearchParams(string SearchTerm, int PageNumber = 1, int PageSize = 4, string Seller = null, string Winner = null, string OrderBy = null, string FilterBy = null);

        public record Response(IReadOnlyList<Item> Results, int PageCount, long TotalCount);

        public override void Map(WebApplication app) => app.MapGroup(this)
         .MapGet(Handler);

        public async Task<IResult> Handler(/*[FromServices] ISender sender,*/ [AsParameters] SearchParams searchParams)
        {
            var query = DB.PagedSearch<Item, Item>();

            query.Sort(x => x.Ascending(a => a.Make));

            if (!string.IsNullOrEmpty(searchParams.SearchTerm))
            {
                query.Match(Search.Full, searchParams.SearchTerm).SortByTextScore();
            }

            query = searchParams.OrderBy switch
            {
                "make" => query.Sort(x => x.Ascending(a => a.Make)),
                "new" => query.Sort(x => x.Descending(a => a.CreatedAt)),
                _ => query.Sort(x => x.Ascending(a => a.AuctionEnd))
            };

            query = searchParams.FilterBy switch
            {
                "finished" => query.Match(x => x.AuctionEnd < DateTime.UtcNow),
                "endingSoon" => query.Match(x => x.AuctionEnd < DateTime.UtcNow.AddHours(6) && x.AuctionEnd > DateTime.UtcNow),
                _ => query.Match(x => x.AuctionEnd > DateTime.UtcNow)
            };

            if (!string.IsNullOrEmpty(searchParams.Seller))
                query.Match(x => x.Seller == searchParams.Seller);

            if (!string.IsNullOrEmpty(searchParams.Winner))
                query.Match(x => x.Winner == searchParams.Winner);

            query.PageNumber(searchParams.PageNumber);
            query.PageSize(searchParams.PageSize);

            var result = await query.ExecuteAsync();

            var response = new Response(result.Results, result.PageCount, result.TotalCount);
            return Results.Ok(response);
        }
    }




}
