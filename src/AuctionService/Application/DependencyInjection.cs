using Application.Common.Interfaces;
using Application.Common.Repository;
using Microsoft.Extensions.DependencyInjection;
using System.Reflection;
using FluentValidation;

namespace AuctionService.Application
{

    public static class DependencyInjection
    {
        public static IServiceCollection AddApplication(this IServiceCollection services)
        {
            services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(Assembly.GetExecutingAssembly()));

            //AutoMapper
            services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

            services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());


            services.AddScoped<IAuctionRepository, AuctionRepository>();

            return services;
        }
    }
}
