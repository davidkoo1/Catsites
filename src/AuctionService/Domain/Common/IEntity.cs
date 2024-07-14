namespace AuctionService.Domain.Common
{
    public interface IEntity<TId>
    {
        /// <summary>
        /// Unique identifier.
        /// </summary>
        TId Id { get; set; }
    }
}
