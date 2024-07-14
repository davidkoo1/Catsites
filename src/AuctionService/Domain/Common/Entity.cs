namespace AuctionService.Domain.Common
{
    public abstract class Entity<TId> : IEntity<TId>
    {
        /// <summary>
        /// Unique identifier.
        /// </summary>

        public TId Id { get; set; }
    }
}
