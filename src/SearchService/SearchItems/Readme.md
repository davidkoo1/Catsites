# Search Service
<p align="center">
  <img src="https://img.shields.io/badge/.NET-8.0-blue?style=flat&logo=.net&logoColor=black" alt=".NET 8.0">
  <img src="https://img.shields.io/badge/MongoDB-DB-greea?style=flat&logo=mongodb&logoColor=green" alt="MongoDB">
  <img src="https://img.shields.io/badge/FastEndpoints-API-red?style=flat&logo=nuget&logoColor=white" alt="FastEndpoints">
  <br>
  <img src="https://img.shields.io/badge/Entity_Framework-ORM-blue" alt="Entity Framework ORM">
  <img src="https://img.shields.io/badge/Service_Bus-RabbitMQ-orange?style=flat&logo=rabbitmq&logoColor=orange" alt="Service Bus - RabbitMQ">
  <img src="https://img.shields.io/badge/AutoMapper-Extensions-yellow" alt="AutoMapper Extensions">
  <img src="https://img.shields.io/badge/Polly-Resilience-blue" alt="Polly">
  <img src="https://img.shields.io/badge/MongoDB-Entities-green" alt="MongoDB Entities">
  <img src="https://img.shields.io/badge/MassTransit-RabbitMQ-black" alt="MassTransit RabbitMQ">
</p>

The Search Service is a component of an auction system responsible for handling search queries and returning paged lists of auctions based on various criteria. This service is essential for providing efficient and accurate search functionality within the auction platform.

## Key Functions of the Service:
- Handling search queries to retrieve paged lists of auctions based on parameters such as search terms, seller, winner, order, and filters.
- Consuming events from other services like AuctionService and BidService to update and maintain the search index.

The service ensures that users can search for auctions using various filters and get updated results based on real-time events from other services.

### **More in [Specification](./searchSvcSpec.pdf) file.**

## TODO:
- Seed (+ConfigsForEntities)/DBInitializer(InInfrastructure)
- Authorize attribute

## Additional Technologies:
- FastEndpoints

## Search Service Specification

### Technologies Used
| Technology                              | Description                                  |
| --------------------------------------- | -------------------------------------------- |
| .Net(8.0) Web API                       | Framework for building APIs                  |
| Mongo DB                                | Database                                     |
| Service Bus - RabbitMQ                  | Messaging system                             |
| AutoMapper.Extensions.Microsoft.DependencyInjection | Object-object mapper                      |
| Microsoft.Extensions.Http.Polly         | Resilience and transient-fault-handling library |
| MongoDB.Entities                        | .NET ODM for MongoDB                         |
| MassTransit.RabbitMQ                    | Distributed application framework for RabbitMQ |

### API Endpoints
- **GET api/search?query** - Get paged list of auctions based on query parameters (searchTerm, pageSize, pageNumber, seller, winner, orderBy, filterBy) Anon

### Other
**[MongoDB documentation](https://mongodb-entities.com/wiki/Get-Started.html)**