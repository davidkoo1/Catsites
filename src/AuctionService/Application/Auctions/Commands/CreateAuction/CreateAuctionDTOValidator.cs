using AuctionService.Application.DTOs;
using FluentValidation;

namespace Application.Auctions.Commands.CreateAuction
{
    public class CreateAuctionDTOValidator : AbstractValidator<CreateAuctionDTO>
    {
        public CreateAuctionDTOValidator()
        {
            RuleFor(x => x.Make).NotEmpty().WithMessage("Make is required.");
            RuleFor(x => x.Model).NotEmpty().WithMessage("Model is required.");
            RuleFor(x => x.Year).GreaterThan(0).WithMessage("Year must be a positive number.");
            RuleFor(x => x.Color).NotEmpty().WithMessage("Color is required.");
            RuleFor(x => x.Mileage).GreaterThanOrEqualTo(0).WithMessage("Mileage must be a non-negative number.");
            RuleFor(x => x.ImageUrl).NotEmpty().WithMessage("ImageUrl is required.");
            RuleFor(x => x.ReservePrice).GreaterThan(0).WithMessage("Reserve Price must be greater than zero.");
            //RuleFor(x => x.AuctionEnd).GreaterThan(DateTime.UtcNow).WithMessage("Auction end time must be in the future.");
        }
    }
}
