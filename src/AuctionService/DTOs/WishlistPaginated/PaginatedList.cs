﻿using Microsoft.EntityFrameworkCore;

namespace AuctionService.DTOs.WishlistPaginated
{
    public class PaginatedList<T>
    {
        public List<T> Items { get; private set; } 
        public int TotalCount { get; private set; } 
        public int PageNumber { get; private set; } 
        public int PageSize { get; private set; } 

        public PaginatedList(List<T> items, int count, int pageNumber, int pageSize)
        {
            Items = items;
            TotalCount = count;
            PageNumber = pageNumber;
            PageSize = pageSize;
        }

        public static async Task<PaginatedList<T>> CreateAsync(IQueryable<T> source, int pageNumber, int pageSize)
        {
            var count = await source.CountAsync();
            var items = await source.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();
            return new PaginatedList<T>(items, count, pageNumber, pageSize);
        }
    }
}
