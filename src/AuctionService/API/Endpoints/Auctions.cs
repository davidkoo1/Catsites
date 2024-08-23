using Application.Auctions.Commands.CreateAuction;
using Application.Auctions.Commands.DeleteAuction;
using Application.Auctions.Commands.UpdateAuction;
using Application.Auctions.Queries.GetAuctions;
using AuctionService.Application.DTOs;
using FluentValidation;

namespace API.Endpoints;

public class Auctions : EndpointGroupBase
{
    public override void Map(WebApplication app)
    {
        app.MapGroup(this).AllowAnonymous()
            .MapGet(GetAllAuctions)
            .MapGet(GetAuctionById, "{id}");
        app.MapGroup(this).RequireAuthorization().MapPost(CreateAuction)
            .MapPut(UpdateAuction, "{id}")
            .MapDelete(DeleteAuction, "{id}");
    }

    public async Task<List<AuctionDto>> GetAllAuctions(ISender sender, string? date)
    {
        return await sender.Send(new GetAuctionsQuery(date));

    }


    public async Task<IResult> GetAuctionById(ISender sender, string id)
    {
        if (!Guid.TryParse(id, out var guidId))
        {
            return Results.BadRequest("Invalid GUID format.");
        }

        var auctionResponse = await sender.Send(new GetAuctionQuery(guidId));

        return auctionResponse is null ? Results.NotFound() : Results.Ok(auctionResponse);
    }



    public async Task<IResult> CreateAuction(ISender sender, CreateAuctionDTO createAuctionDto, IValidator<CreateAuctionDTO> validator)
    {
        var validationResult = await validator.ValidateAsync(createAuctionDto);

        if (!validationResult.IsValid)
        {
            return Results.ValidationProblem(validationResult.ToDictionary());
        }

        var command = new CreateAuctionCommand(createAuctionDto);
        var (result, newAuction) = await sender.Send(command);

        if (!result) return Results.BadRequest("Could not save changes to the DB");

        return Results.Created($"/api/auctions/{newAuction.Id}", newAuction);
    }


    public async Task<IResult> UpdateAuction(ISender sender, Guid id, UpdateAuctionDto updateAuctionDto, IHttpContextAccessor httpContextAccessor)
    {
        var auction = await sender.Send(new GetAuctionQuery(id));

        if (auction is null) return Results.NotFound();

        // Check if the current user is authorized to update the auction
        var currentUser = httpContextAccessor.HttpContext?.User?.Identity?.Name;
        if (auction.Seller != currentUser)
        {
            return Results.Forbid();
        }

        var command = new UpdateAuctionCommand(id, updateAuctionDto);
        var result = await sender.Send(command);

        if (result) return Results.Ok();

        return Results.BadRequest("Problem saving changes");
    }


    public async Task<IResult> DeleteAuction(ISender sender, Guid id)
    {
        var auction = await sender.Send(new GetAuctionQuery(id));

        if (auction is null) return Results.NotFound();

        var result = await sender.Send(new DeleteAuctionCommand(id));

        if (!result) return Results.BadRequest("Could not update DB");


        return Results.Ok();

    }

}

