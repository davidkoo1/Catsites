using Application.Common.Interfaces;
using AuctionService.Infrastructure.Persistance;
using AuctionService.IntegrationTests.Util;
using MassTransit;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Testcontainers.PostgreSql;
using WebMotions.Fake.Authentication.JwtBearer;
namespace AuctionService.IntegrationTests.Fixtures
{
    public class CustomWebAppFactory : WebApplicationFactory<Program>, IAsyncLifetime
    {
        private PostgreSqlContainer _postrgesSqlConnection = new PostgreSqlBuilder().Build();

        public async Task InitializeAsync()
        {
            await _postrgesSqlConnection.StartAsync();
        }

        protected override void ConfigureWebHost(IWebHostBuilder builder)
        {
            builder.ConfigureTestServices(services =>
            {
                services.RemoveDbContext<AuctionDbContext>();

                services.AddDbContext<AuctionDbContext>(options =>
                {
                    options.UseNpgsql(_postrgesSqlConnection.GetConnectionString());
                });

                //services.AddScoped<IAuctionDbContext, AuctionDbContext>();

                services.AddMassTransitTestHarness();


                services.EnsureCreated<AuctionDbContext>();

                services.AddAuthentication(FakeJwtBearerDefaults.AuthenticationScheme)
                .AddFakeJwtBearer(opt =>
                {
                    opt.BearerValueType = FakeJwtBearerBearerValueType.Jwt;
                });

            });
        }

        Task IAsyncLifetime.DisposeAsync() => _postrgesSqlConnection.DisposeAsync().AsTask();
    }

}
