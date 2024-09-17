using AuctionService.Data.Interfaces;
using AuctionService.DTOs;
using AuctionService.DTOs.WishlistPaginated;
using AuctionService.Entities;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace AuctionService.Data.Repository
{

    public class WishListRepository : IWishListRepository
    {
        private readonly AuctionDbContext _context;
        private readonly IMapper _mapper;

        public WishListRepository(AuctionDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<PaginatedList<AuctionDto>> GetPagiatedWishlistByUserIdAsync(string userId, SearchParams searchParams)
        {
            // Создаем запрос для выборки всех элементов в списке желаемого для данного пользователя
            IQueryable<Auction> query = _context.Wishlists
                .Where(w => w.UserId == userId)
                .Include(w => w.Auction).ThenInclude(a => a.Item)
                .Select(w => w.Auction);

            // Применяем сортировку
            if (searchParams.OrderBy == "make")
            {
                query = query.OrderBy(a => a.Item.Make).ThenBy(a => a.Item.Model);
            }
            else if (searchParams.OrderBy == "new")
            {
                query = query.OrderByDescending(a => a.CreatedAt);
            }
            else
            {
                query = query.OrderBy(a => a.AuctionEnd);
            }

            // Применяем фильтрацию
            if (searchParams.FilterBy == "finished")
            {
                query = query.Where(a => a.AuctionEnd < DateTime.UtcNow);
            }
            else if (searchParams.FilterBy == "endingSoon")
            {
                query = query.Where(a => a.AuctionEnd < DateTime.UtcNow.AddHours(6) && a.AuctionEnd > DateTime.UtcNow);
            }
            else
            {
                query = query.Where(a => a.AuctionEnd > DateTime.UtcNow);
            }

            // Получаем пагинированный список
            var paginatedItems = await PaginatedList<Auction>.CreateAsync(query, searchParams.PageNumber, searchParams.PageSize);

            // Проецируем на DTO
            var auctionDtos = paginatedItems.Items.Select(a => _mapper.Map<AuctionDto>(a)).ToList();
            auctionDtos.ForEach(a => a.IsInWishlist = true);

            return new PaginatedList<AuctionDto>(auctionDtos, paginatedItems.TotalCount, paginatedItems.PageNumber, paginatedItems.PageSize);
        }

        public async Task<bool> AddToWishlistAsync(string userId, Guid auctionId)
        {
            
            var existingItem = await _context.Wishlists
                .Where(w => w.UserId == userId && w.AuctionId == auctionId)
                .FirstOrDefaultAsync();

            if (existingItem != null)
            {
                return false;
            }

            var wishlistItem = new WishlistItem { UserId = userId, AuctionId = auctionId };
            _context.Wishlists.Add(wishlistItem);

            return await SaveChangesAsync();
        }


        public async Task<bool> RemoveFromWishlistAsync(string userId, Guid auctionId)
        {
            var wishlistItem = await _context.Wishlists
                .Where(w => w.UserId == userId && w.AuctionId == auctionId)
                .FirstOrDefaultAsync();

            if (wishlistItem == null)
            {
                return false;
            }

            _context.Wishlists.Remove(wishlistItem);
            await _context.SaveChangesAsync();

            return true;
        }


        public async Task<List<AuctionDto>> GetWishlistByUserIdAsync(string userId = null)
        {
            var query = _context.Wishlists.Where(w => w.UserId == userId)
                .Select(w => w.Auction)
                .Include(a => a.Item).AsQueryable();


            return await query.ProjectTo<AuctionDto>(_mapper.ConfigurationProvider).ToListAsync();


        }

        public async Task<List<Guid>> GetWishlistGuidsByUserIdAsync(string userId)
            => await _context.Wishlists
            .Where(w => w.UserId == userId)
            .Select(w => w.AuctionId)
            .Distinct()
            .ToListAsync();

        public async Task<bool> SaveChangesAsync() => await _context.SaveChangesAsync() > 0;
    }

}
