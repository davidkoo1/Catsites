using System.ComponentModel.DataAnnotations;

namespace AuctionService.Application.DTOs
{
    public record CreateAuctionDTO
    {
        [Required]
        public string Make { get; set; }

        [Required]
        public string Model { get; set; }

        [Required]
        public int Year { get; set; }

        [Required]
        public string Color { get; set; }

        [Required]
        public int Mileage { get; set; }

        [Required]
        public string ImageUrl { get; set; }

        [Required]
        public int ReservePrice { get; set; }

        [Required]
        public DateTime AuctionEnd { get; set; }    //Сделать стандартное время(2 часа например, если хотим дольше - платно)

    }


}
