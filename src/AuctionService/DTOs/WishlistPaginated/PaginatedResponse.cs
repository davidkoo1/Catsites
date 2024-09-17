namespace AuctionService.DTOs.WishlistPaginated
{
    public class PaginatedResponse<T>
    {
        public List<T> Results { get; set; }
        public int PageCount { get; set; }
        public int TotalCount { get; set; }
    }
}
