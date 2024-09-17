using AuctionService.Data.Interfaces;
using AuctionService.DTOs;
using AuctionService.Entities;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using CsvHelper;
using Microsoft.EntityFrameworkCore;
using System.Globalization;

namespace AuctionService.Data.Repository;

public class AuctionRepository : IAuctionRepository
{
    private readonly AuctionDbContext _context;
    private readonly IMapper _mapper;

    public AuctionRepository(AuctionDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }
    public async Task<bool> IsAuctionInWishlist(string userId, Guid auctionId)
    {
        return await _context.Wishlists
                             .AnyAsync(w => w.UserId == userId && w.AuctionId == auctionId);
    }


    public void AddAuction(Auction auction)
    {
        _context.Auctions.Add(auction);
    }

    public async Task<AuctionDto> GetAuctionByIdAsync(Guid id)
    {
        return await _context.Auctions
            .ProjectTo<AuctionDto>(_mapper.ConfigurationProvider)
            .FirstOrDefaultAsync(x => x.Id == id);
    }

    public async Task<Auction> GetAuctionEntityById(Guid id)
    {
        return await _context.Auctions
            .Include(x => x.Item)
            .FirstOrDefaultAsync(x => x.Id == id);
    }

    public async Task<List<AuctionDto>> GetAuctionsAsync(string date)
    {
        var query = _context.Auctions.OrderBy(x => x.Item.Make).AsQueryable();

        if (!string.IsNullOrEmpty(date))
        {
            query = query.Where(x => x.UpdatedAt.CompareTo(DateTime.Parse(date).ToUniversalTime()) > 0);
        }

        return await query.ProjectTo<AuctionDto>(_mapper.ConfigurationProvider).ToListAsync();
    }

    public void RemoveAuction(Auction auction)
    {
        _context.Auctions.Remove(auction);
    }

    public async Task<bool> SaveChangesAsync()
    {
        return await _context.SaveChangesAsync() > 0;
    }

    public async Task<byte[]> ExportAuctionToCsvAsync(Guid id)
    {
        try
        {
            var auction = await _context.Auctions
            .ProjectTo<AuctionDto>(_mapper.ConfigurationProvider)
            .FirstOrDefaultAsync(x => x.Id == id);

            if (auction == null)
            {
                throw new Exception("Auction not found.");
            }

            using (var memoryStream = new MemoryStream())
            using (var streamWriter = new StreamWriter(memoryStream))
            using (var csvWriter = new CsvWriter(streamWriter, CultureInfo.InvariantCulture))
            {

                /*csvWriter.WriteField("Field Name");
                csvWriter.WriteField("Value");
                csvWriter.NextRecord();
                */

                streamWriter.WriteLine("Auction Details");
                csvWriter.NextRecord();

                streamWriter.WriteLine("Car Information:");
                csvWriter.WriteField("ImageUrl");
                csvWriter.WriteField(auction.ImageUrl);
                csvWriter.NextRecord();

                csvWriter.WriteField("Make");
                csvWriter.WriteField(auction.Make);
                csvWriter.NextRecord();

                csvWriter.WriteField("Model");
                csvWriter.WriteField(auction.Model);
                csvWriter.NextRecord();

                csvWriter.WriteField("Year");
                csvWriter.WriteField(auction.Year.ToString());
                csvWriter.NextRecord();

                csvWriter.WriteField("Mileage");
                csvWriter.WriteField(auction.Mileage.ToString());
                csvWriter.NextRecord();

                csvWriter.WriteField("Color");
                csvWriter.WriteField(auction.Color);
                csvWriter.NextRecord();


                csvWriter.NextRecord();
                streamWriter.WriteLine("Auction Information:");
                csvWriter.WriteField("Auction End");
                csvWriter.WriteField(auction.AuctionEnd.ToString("g"));
                csvWriter.NextRecord();

                csvWriter.WriteField("High Bid");
                csvWriter.WriteField(auction.CurrentHighBid.ToString());
                csvWriter.NextRecord();

                csvWriter.WriteField("Reserve Price");
                csvWriter.WriteField(auction.ReservePrice > 0 ? "Yes" : "No");
                csvWriter.NextRecord();

                csvWriter.WriteField("Winner");
                csvWriter.WriteField(auction.Winner ?? "None");
                csvWriter.NextRecord();

                csvWriter.WriteField("Status");
                csvWriter.WriteField(auction.Status);
                csvWriter.NextRecord();

                csvWriter.WriteField("Auction Created At");
                csvWriter.WriteField(auction.CreatedAt.ToString("g"));
                csvWriter.NextRecord();

                csvWriter.WriteField("Last Update Auction");
                csvWriter.WriteField(auction.UpdatedAt.ToString("g"));
                csvWriter.NextRecord();


                csvWriter.NextRecord();
                streamWriter.WriteLine("Seller  Information:");
                csvWriter.WriteField("Seller");
                csvWriter.WriteField(auction.Seller);
                csvWriter.NextRecord();

                streamWriter.Flush();
                return memoryStream.ToArray();
            }
        }
        catch (Exception)
        {
            return new byte[0];
        }


    }




}
