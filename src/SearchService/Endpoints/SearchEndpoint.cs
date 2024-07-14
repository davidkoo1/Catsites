using FastEndpoints;
using MongoDB.Entities;
using SearchService.Models;

namespace SearchService.Endpoints
{
    public class SearchParams
    {
        public string SearchTerm { get; set; }
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 4;
        public string Seller { get; set; }
        public string Winner { get; set; }
        public string OrderBy { get; set; }
        public string FilterBy { get; set; }
    }

    public record Response(IReadOnlyList<Item> Results, int PageCount, long TotalCount);

    public class SearchEndpoint : Endpoint<SearchParams, Response>
    {
        
        public override void Configure()
        {
            Verbs(Http.GET);
            Routes("api/search");
            AllowAnonymous();
        }

        public override async Task HandleAsync(SearchParams req, CancellationToken ct)
        {
            var query = DB.PagedSearch<Item, Item>();

            query.Sort(x => x.Ascending(a => a.Make));

            if (!string.IsNullOrEmpty(req.SearchTerm))
            {
                query.Match(Search.Full, req.SearchTerm).SortByTextScore();
            }

            query = req.OrderBy switch
            {
                "make" => query.Sort(x => x.Ascending(a => a.Make)),
                "new" => query.Sort(x => x.Descending(a => a.CreatedAt)),
                _ => query.Sort(x => x.Ascending(a => a.AuctionEnd))
            };

            query = req.FilterBy switch
            {
                "finished" => query.Match(x => x.AuctionEnd < DateTime.UtcNow),
                "endingSoon" => query.Match(x => x.AuctionEnd < DateTime.UtcNow.AddHours(6) && x.AuctionEnd > DateTime.UtcNow),
                _ => query.Match(x => x.AuctionEnd > DateTime.UtcNow)
            };

            if (!string.IsNullOrEmpty(req.Seller))
                query.Match(x => x.Seller == req.Seller);

            if (!string.IsNullOrEmpty(req.Winner))
                query.Match(x => x.Winner == req.Winner);

            query.PageNumber(req.PageNumber);
            query.PageSize(req.PageSize);

            var result = await query.ExecuteAsync();

            var response = new Response(result.Results, result.PageCount, result.TotalCount);

            await SendAsync(response, cancellation: ct);
        }
    }

}
