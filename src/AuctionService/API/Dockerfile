FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app
EXPOSE 80

# copy all .csproj files and restore as distinct layers. Use of the same Copy command
# for every dockerfile in the project to take advantage of docker caching
COPY Carsites.sln Carsites.sln
COPY src/AuctionService/API/API.csproj src/AuctionService/API/API.csproj
COPY src/AuctionService/Application/Application.csproj src/AuctionService/Application/Application.csproj
COPY src/AuctionService/Domain/Domain.csproj src/AuctionService/Domain/Domain.csproj
COPY src/AuctionService/Infrastructure/Infrastructure.csproj src/AuctionService/Infrastructure/Infrastructure.csproj
COPY src/SearchService/SearchService.csproj src/SearchService/SearchService.csproj
COPY src/GatewayService/GatewayService.csproj src/GatewayService/GatewayService.csproj
COPY src/Contracts/Contracts.csproj src/Contracts/Contracts.csproj
COPY src/IdentityService/IdentityService.csproj src/IdentityService/IdentityService.csproj

# Restore package deps
RUN dotnet restore Carsites.sln

# Copy the app folders over
COPY src/AuctionService src/AuctionService
COPY src/Contracts src/Contracts
WORKDIR /app/src/AuctionService/API
RUN dotnet publish -c Release -o /app/src/out

# Build runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/src/out .
ENTRYPOINT [ "dotnet", "API.dll" ]