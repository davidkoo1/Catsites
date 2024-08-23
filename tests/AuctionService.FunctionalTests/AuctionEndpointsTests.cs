using API.Endpoints;
using Application.Auctions.Commands.CreateAuction;
using Application.Auctions.Commands.DeleteAuction;
using Application.Auctions.Commands.UpdateAuction;
using Application.Auctions.Queries.GetAuctions;
using AuctionService.Application.DTOs;
using AutoFixture;
using FluentValidation;
using FluentValidation.Results;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Moq;

namespace AuctionService.FunctionalTests
{
    public class AuctionEndpointsTests
    {
        private readonly Mock<ISender> _mediatorMock;
        private readonly Fixture _fixture;
        private readonly Auctions _endpoints;

        public AuctionEndpointsTests()
        {
            _mediatorMock = new Mock<ISender>();
            _fixture = new Fixture();
            _endpoints = new Auctions();
        }

        [Fact]
        public async Task GetAllAuctions_WithNoParams_Returns10Auctions()
        {
            // Arrange
            var auctions = _fixture.CreateMany<AuctionDto>(10).ToList();
            _mediatorMock.Setup(sender => sender.Send(It.IsAny<GetAuctionsQuery>(), default))
                .ReturnsAsync(auctions);

            // Act
            var result = await _endpoints.GetAllAuctions(_mediatorMock.Object, null);

            // Assert
            Assert.Equal(10, result.Count);
            _mediatorMock.Verify(x => x.Send(It.IsAny<GetAuctionsQuery>(), default), Times.Once);
        }

        [Fact]
        public async Task GetAuctionById_WithValidGuid_ReturnsAuction()
        {
            // Arrange
            var auction = _fixture.Create<AuctionDto>();
            _mediatorMock.Setup(sender => sender.Send(It.IsAny<GetAuctionQuery>(), default))
                .ReturnsAsync(auction);

            // Act
            var result = await _endpoints.GetAuctionById(_mediatorMock.Object, auction.Id.ToString());

            // Assert
            var okResult = Assert.IsType<Ok<AuctionDto>>(result);
            Assert.Equal(auction.Make, okResult.Value?.Make);
            _mediatorMock.Verify(x => x.Send(It.IsAny<GetAuctionQuery>(), default), Times.Once);
        }

        [Fact]
        public async Task GetAuctionById_WithInValidGuid_ReturnsNotFound()
        {
            // Arrange
            _mediatorMock.Setup(sender => sender.Send(It.IsAny<GetAuctionQuery>(), default))
                .ReturnsAsync((AuctionDto?)null);

            // Act
            var result = await _endpoints.GetAuctionById(_mediatorMock.Object, Guid.NewGuid().ToString());

            // Assert
            Assert.IsType<NotFound>(result);
        }

        [Fact]
        public async Task CreateAuction_WithInValidCreateAuctionDto_ReturnsCreatedAtAction()
        {
            // Arrange
            var createAuctionDto = _fixture.Create<CreateAuctionDTO>();
            var newAuction = _fixture.Create<AuctionDto>();
            var validatorMock = new Mock<IValidator<CreateAuctionDTO>>();

            validatorMock.Setup(v => v.ValidateAsync(createAuctionDto, It.IsAny<CancellationToken>()))
                         .ReturnsAsync(new ValidationResult());

            _mediatorMock.Setup(sender => sender.Send(It.IsAny<CreateAuctionCommand>(), default))
                         .ReturnsAsync(Tuple.Create(true, newAuction));

            // Act
            var result = await _endpoints.CreateAuction(_mediatorMock.Object, createAuctionDto, validatorMock.Object);

            // Assert
            var createdResult = Assert.IsType<Created<AuctionDto>>(result);
            Assert.Equal($"/api/auctions/{newAuction.Id}", createdResult.Location);
            Assert.Equal(newAuction, createdResult.Value);
            _mediatorMock.Verify(x => x.Send(It.IsAny<CreateAuctionCommand>(), default), Times.Once);
        }


        [Fact]
        public async Task CreateAuction_FailedSave_Returns400BadRequest()
        {
            // Arrange
            var createAuctionDto = _fixture.Create<CreateAuctionDTO>();
            var validatorMock = new Mock<IValidator<CreateAuctionDTO>>();

            validatorMock.Setup(v => v.ValidateAsync(createAuctionDto, It.IsAny<CancellationToken>()))
                         .ReturnsAsync(new ValidationResult());

            _mediatorMock.Setup(sender => sender.Send(It.IsAny<CreateAuctionCommand>(), default))
                         .ReturnsAsync(Tuple.Create(false, (AuctionDto?)null));

            // Act
            var result = await _endpoints.CreateAuction(_mediatorMock.Object, createAuctionDto, validatorMock.Object);

            // Assert
            var badRequestResult = Assert.IsType<BadRequest<string>>(result);
            Assert.Equal("Could not save changes to the DB", badRequestResult.Value);
        }



        [Fact]
        public async Task UpdateAuction_WithUpdateAuctionDto_ReturnsOkResponse()
        {
            // Arrange
            var auction = _fixture.Create<AuctionDto>();
            var updateAuctionDto = _fixture.Create<UpdateAuctionDto>();
            var httpContextAccessorMock = new Mock<IHttpContextAccessor>();

            httpContextAccessorMock.Setup(x => x.HttpContext!.User.Identity!.Name).Returns(auction.Seller);

            _mediatorMock.Setup(sender => sender.Send(It.IsAny<GetAuctionQuery>(), default))
                         .ReturnsAsync(auction);
            _mediatorMock.Setup(sender => sender.Send(It.IsAny<UpdateAuctionCommand>(), default))
                         .ReturnsAsync(true);

            // Act
            var result = await _endpoints.UpdateAuction(_mediatorMock.Object, auction.Id, updateAuctionDto, httpContextAccessorMock.Object);

            // Assert
            Assert.IsType<Ok>(result);
        }

        [Fact]
        public async Task UpdateAuction_WithInvalidGuid_ReturnsNotFound()
        {
            // Arrange
            _mediatorMock.Setup(sender => sender.Send(It.IsAny<GetAuctionQuery>(), default))
                         .ReturnsAsync((AuctionDto?)null);

            var updateAuctionDto = _fixture.Create<UpdateAuctionDto>();
            var httpContextAccessorMock = new Mock<IHttpContextAccessor>();

            // Act
            var result = await _endpoints.UpdateAuction(_mediatorMock.Object, Guid.NewGuid(), updateAuctionDto, httpContextAccessorMock.Object);

            // Assert
            Assert.IsType<NotFound>(result);
        }


        [Fact]
        public async Task DeleteAuction_WithValidUser_ReturnsOkResponse()
        {
            // Arrange
            var auction = _fixture.Create<AuctionDto>();

            _mediatorMock.Setup(sender => sender.Send(It.IsAny<GetAuctionQuery>(), default))
                .ReturnsAsync(auction);
            _mediatorMock.Setup(sender => sender.Send(It.IsAny<DeleteAuctionCommand>(), default))
                .ReturnsAsync(true);

            // Act
            var result = await _endpoints.DeleteAuction(_mediatorMock.Object, auction.Id);

            // Assert
            Assert.IsType<Ok>(result);
        }

        [Fact]
        public async Task DeleteAuction_WithInvalidGuid_Returns404Response()
        {
            // Arrange
            _mediatorMock.Setup(sender => sender.Send(It.IsAny<GetAuctionQuery>(), default))
                .ReturnsAsync((AuctionDto?)null);

            // Act
            var result = await _endpoints.DeleteAuction(_mediatorMock.Object, Guid.NewGuid());

            // Assert
            Assert.IsType<NotFound>(result);
        }
    }
}
